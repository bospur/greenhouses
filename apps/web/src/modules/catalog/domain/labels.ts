import type { GreenhouseShape, ProductDimensions } from '@/data/repositories/catalog';

export const SHAPE_LABELS: Record<GreenhouseShape, string> = {
  arch: 'Арочная',
  drop: 'Каплевидная',
  gable: 'Домик',
};

const num = (v: number) => v.toLocaleString('ru-RU', { maximumFractionDigits: 2 });

/** «3×4 м» — ширина × длина */
export function formatFootprint(d: ProductDimensions): string {
  return `${num(d.widthM)}×${num(d.lengthM)} м`;
}

export function getFootprintArea(d: ProductDimensions): number {
  return Math.round(d.widthM * d.lengthM * 100) / 100;
}

export function getDiscountPercent(price: number, oldPrice: number | null): number | null {
  if (!oldPrice || oldPrice <= price) return null;
  return Math.round((1 - price / oldPrice) * 100);
}
