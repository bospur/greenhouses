import type { GreenhouseShape, ProductDTO } from '@/data/repositories/catalog';
import { getFootprintArea } from './labels';

export type CatalogSort = 'popular' | 'price-asc' | 'price-desc' | 'area-desc';

export type CatalogFilters = {
  shape: GreenhouseShape | null;
  widthM: number | null;
  priceMax: number | null;
  sort: CatalogSort;
};

export type CatalogFacets = {
  shapes: GreenhouseShape[];
  widths: number[];
  priceMin: number;
  priceMax: number;
};

export const DEFAULT_CATALOG_FILTERS: CatalogFilters = {
  shape: null,
  widthM: null,
  priceMax: null,
  sort: 'popular',
};

export const CATALOG_SORT_OPTIONS: ReadonlyArray<{ value: CatalogSort; label: string }> = [
  { value: 'popular', label: 'Сначала популярные' },
  { value: 'price-asc', label: 'Сначала дешевле' },
  { value: 'price-desc', label: 'Сначала дороже' },
  { value: 'area-desc', label: 'Большая площадь' },
];

export const PRICE_STEP = 1000;

const SHAPES: readonly GreenhouseShape[] = ['arch', 'drop', 'gable'];
const SORTS = CATALOG_SORT_OPTIONS.map((o) => o.value);

const PARAM = {
  shape: 'shape',
  width: 'width',
  priceMax: 'price_max',
  sort: 'sort',
} as const;

const positiveNumber = (raw: string | null): number | null => {
  if (!raw) return null;
  const value = Number(raw);
  return Number.isFinite(value) && value > 0 ? value : null;
};

/** URL → фильтры; мусорные значения молча отбрасываются */
export function parseCatalogFilters(params: URLSearchParams): CatalogFilters {
  const shape = params.get(PARAM.shape);
  const sort = params.get(PARAM.sort);
  return {
    shape: SHAPES.includes(shape as GreenhouseShape) ? (shape as GreenhouseShape) : null,
    widthM: positiveNumber(params.get(PARAM.width)),
    priceMax: positiveNumber(params.get(PARAM.priceMax)),
    sort: SORTS.includes(sort as CatalogSort) ? (sort as CatalogSort) : DEFAULT_CATALOG_FILTERS.sort,
  };
}

/** Фильтры → URL; значения по умолчанию не пишутся, чтобы ссылка оставалась короткой */
export function toCatalogSearchParams(filters: CatalogFilters): URLSearchParams {
  const params = new URLSearchParams();
  if (filters.shape) params.set(PARAM.shape, filters.shape);
  if (filters.widthM) params.set(PARAM.width, String(filters.widthM));
  if (filters.priceMax) params.set(PARAM.priceMax, String(filters.priceMax));
  if (filters.sort !== DEFAULT_CATALOG_FILTERS.sort) params.set(PARAM.sort, filters.sort);
  return params;
}

export function hasActiveFilters(filters: CatalogFilters): boolean {
  return filters.shape !== null || filters.widthM !== null || filters.priceMax !== null;
}

export function getCatalogFacets(products: ProductDTO[]): CatalogFacets {
  const prices = products.map((p) => p.price);
  return {
    shapes: SHAPES.filter((s) => products.some((p) => p.shape === s)),
    widths: [...new Set(products.map((p) => p.dimensions.widthM))].sort((a, b) => a - b),
    priceMin: prices.length ? Math.floor(Math.min(...prices) / PRICE_STEP) * PRICE_STEP : 0,
    priceMax: prices.length ? Math.ceil(Math.max(...prices) / PRICE_STEP) * PRICE_STEP : 0,
  };
}

const comparators: Record<CatalogSort, (a: ProductDTO, b: ProductDTO) => number> = {
  popular: (a, b) => Number(b.isPopular) - Number(a.isPopular),
  'price-asc': (a, b) => a.price - b.price,
  'price-desc': (a, b) => b.price - a.price,
  'area-desc': (a, b) => getFootprintArea(b.dimensions) - getFootprintArea(a.dimensions) || a.price - b.price,
};

export function applyCatalogFilters(products: ProductDTO[], filters: CatalogFilters): ProductDTO[] {
  return products
    .filter(
      (p) =>
        (filters.shape === null || p.shape === filters.shape) &&
        (filters.widthM === null || p.dimensions.widthM === filters.widthM) &&
        (filters.priceMax === null || p.price <= filters.priceMax),
    )
    .sort(comparators[filters.sort]);
}
