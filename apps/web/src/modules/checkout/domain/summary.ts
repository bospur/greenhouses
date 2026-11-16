import type { GreenhouseShape, ProductDimensions, ProductDTO } from '@/data/repositories/catalog';
import type { CargoDTO } from '@/data/repositories/delivery';
import { SHAPE_LABELS, formatFootprint } from '@/modules/catalog/domain';
import {
  buildConfigSpecs,
  calculatePrice,
  getConfigTitle,
  toConfigSearchParams,
  type GreenhouseConfig,
} from '@/modules/configurator/domain';
import { APP_ROUTES } from '@/shared/constants';
import { estimateCargo } from './cargo';

/** Всё, что оформление показывает о товаре: подпись, цена-превью, чертёж, груз для доставки */
export type OrderItemSummary = {
  title: string;
  subtitle: string;
  price: number;
  oldPrice: number | null;
  specs: { label: string; value: string }[];
  drawing: { shape: GreenhouseShape; dimensions: ProductDimensions; doors: number; vents: number };
  cargo: CargoDTO;
  edit: { href: string; label: string };
};

const num = (v: number) => v.toLocaleString('ru-RU', { maximumFractionDigits: 2 });
const formatSize = ({ widthM, lengthM, heightM }: ProductDimensions) =>
  `${num(widthM)}×${num(lengthM)}×${num(heightM)} м`;

export function summarizeProduct(product: ProductDTO): OrderItemSummary {
  return {
    title: `«${product.name}» ${formatFootprint(product.dimensions)}`,
    subtitle: `${SHAPE_LABELS[product.shape]} теплица из каталога`,
    price: product.price,
    oldPrice: product.oldPrice,
    specs: [
      { label: 'Размеры (Ш×Д×В)', value: formatSize(product.dimensions) },
      { label: 'Каркас', value: product.frameProfile },
      { label: 'Поликарбонат', value: `${product.polycarbonateMm} мм` },
      { label: 'Двери / форточки', value: `${product.doors} / ${product.vents}` },
    ],
    drawing: { shape: product.shape, dimensions: product.dimensions, doors: product.doors, vents: product.vents },
    cargo: estimateCargo(product.dimensions, product.polycarbonateMm),
    edit: { href: APP_ROUTES.configurator.fromProduct(product.slug), label: 'Изменить размеры' },
  };
}

export function summarizeConfig(config: GreenhouseConfig): OrderItemSummary {
  const dimensions = { widthM: config.widthM, lengthM: config.lengthM, heightM: config.heightM };
  return {
    title: getConfigTitle(config),
    subtitle: 'Своя конфигурация',
    price: calculatePrice(config).total,
    oldPrice: null,
    specs: buildConfigSpecs(config).filter((s) => s.label !== 'Площадь'),
    drawing: { shape: config.shape, dimensions, doors: config.doors, vents: config.vents },
    cargo: estimateCargo(dimensions, config.polycarbonateMm),
    edit: { href: APP_ROUTES.configurator.withConfig(toConfigSearchParams(config).toString()), label: 'Изменить' },
  };
}
