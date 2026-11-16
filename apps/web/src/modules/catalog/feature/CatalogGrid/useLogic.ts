import { useMemo } from 'react';
import { useSearchParams } from 'react-router';
import { useProductsQuery, type GreenhouseShape } from '@/data/repositories/catalog';
import { getApiErrorMessage, pluralize } from '@/shared/utils';
import {
  applyCatalogFilters,
  DEFAULT_CATALOG_FILTERS,
  getCatalogFacets,
  hasActiveFilters,
  parseCatalogFilters,
  toCatalogSearchParams,
  type CatalogFilters,
  type CatalogSort,
} from '../../domain';

const SKELETON_COUNT = 6;

export function useCatalogGridLogic() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data, isPending, isError, error, refetch } = useProductsQuery();

  const filters = useMemo(() => parseCatalogFilters(searchParams), [searchParams]);
  const facets = useMemo(() => getCatalogFacets(data ?? []), [data]);
  const products = useMemo(() => applyCatalogFilters(data ?? [], filters), [data, filters]);

  const update = (patch: Partial<CatalogFilters>) =>
    setSearchParams(toCatalogSearchParams({ ...filters, ...patch }), { replace: true, preventScrollReset: true });

  const priceValue = Math.min(Math.max(filters.priceMax ?? facets.priceMax, facets.priceMin), facets.priceMax);

  return {
    isLoading: isPending,
    isError,
    errorMessage: getApiErrorMessage(error),
    retry: () => void refetch(),
    skeletonCount: SKELETON_COUNT,

    products,
    isEmpty: !isPending && !isError && products.length === 0,
    resultLabel: `${products.length} ${pluralize(products.length, ['модель', 'модели', 'моделей'])}`,

    filters,
    facets,
    priceValue,
    hasActiveFilters: hasActiveFilters(filters),

    toggleShape: (shape: GreenhouseShape | null) => update({ shape: filters.shape === shape ? null : shape }),
    toggleWidth: (widthM: number | null) => update({ widthM: filters.widthM === widthM ? null : widthM }),
    setPriceMax: (value: number) => update({ priceMax: value >= facets.priceMax ? null : value }),
    setSort: (sort: CatalogSort) => update({ sort }),
    resetFilters: () => update({ ...DEFAULT_CATALOG_FILTERS, sort: filters.sort }),
  };
}

export type CatalogGridLogic = ReturnType<typeof useCatalogGridLogic>;
