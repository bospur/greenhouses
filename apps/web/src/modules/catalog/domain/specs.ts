import type { ProductDTO } from '@/data/repositories/catalog';
import { formatMeters, pluralize } from '@/shared/utils';
import { getFootprintArea, SHAPE_LABELS } from './labels';

export type SpecRow = {
  label: string;
  value: string;
};

const pcs = (n: number) => `${n} шт.`;

export function buildSpecRows(p: ProductDTO): SpecRow[] {
  const area = getFootprintArea(p.dimensions).toLocaleString('ru-RU');
  return [
    { label: 'Форма', value: SHAPE_LABELS[p.shape] },
    { label: 'Ширина', value: formatMeters(p.dimensions.widthM) },
    { label: 'Длина', value: formatMeters(p.dimensions.lengthM) },
    { label: 'Высота в коньке', value: formatMeters(p.dimensions.heightM) },
    { label: 'Площадь', value: `${area} м²` },
    { label: 'Каркас', value: p.frameProfile },
    { label: 'Покрытие', value: `Сотовый поликарбонат ${p.polycarbonateMm} мм` },
    { label: 'Двери', value: pcs(p.doors) },
    { label: 'Форточки', value: pcs(p.vents) },
    { label: 'Снеговая нагрузка', value: `до ${p.snowLoadKgM2} кг/м²` },
    { label: 'Гарантия', value: `${p.warrantyYears} ${pluralize(p.warrantyYears, ['год', 'года', 'лет'])}` },
  ];
}
