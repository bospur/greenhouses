import type { CargoDTO } from '@/data/repositories/delivery';
import type { ProductDimensions } from '@/data/repositories/catalog';

/** Масса сотового поликарбоната, кг/м² */
const POLYCARBONATE_KG_M2: Record<number, number> = { 4: 0.8, 6: 1.3, 8: 1.5 };
/** Площадь покрытия больше площади основания: стены, торцы, дуги */
const COVER_FACTOR = 1.7;
/** Каркас: кг на погонный метр длины на метр ширины + торцы */
const FRAME_KG_PER_M_PER_WIDTH = 7;
const FRAME_KG_PER_M = 6;

const round = (v: number, digits: number) => Math.round(v * 10 ** digits) / 10 ** digits;

/**
 * Оценка груза для котировок ТК до данных от заказчика (вес и габариты упаковки).
 * Сервер в B3 считает груз сам по товару — здесь только чтобы показать стоимость.
 */
export function estimateCargo({ widthM, lengthM }: ProductDimensions, polycarbonateMm: number): CargoDTO {
  const area = widthM * lengthM;
  const polyKg = (POLYCARBONATE_KG_M2[polycarbonateMm] ?? POLYCARBONATE_KG_M2[4]) * area * COVER_FACTOR;
  const frameKg = lengthM * (widthM * FRAME_KG_PER_M_PER_WIDTH + FRAME_KG_PER_M);
  return {
    weightKg: Math.ceil(polyKg + frameKg),
    volumeM3: round(0.2 + area * 0.05, 2),
  };
}
