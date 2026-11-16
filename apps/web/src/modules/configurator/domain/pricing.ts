import type { GreenhouseShape } from '@/data/repositories/catalog';
import { getFrameOption, normalizeConfig } from './constraints';
import { EXTRA_OPTIONS, FRAME_PROFILE_LABELS, POLYCARBONATE_OPTIONS, type ExtraOption } from './options';
import type { GreenhouseConfig } from './types';

/**
 * Превью цены на фронте. Формула — заглушка до ответа заказчика (PLAN, вопрос №2);
 * источник истины — `POST /pricing/quote` (ADR-001).
 */
const BASE_RATE_PER_M2: Record<GreenhouseShape, number> = {
  arch: 1500,
  drop: 1700,
  gable: 1900,
};
/** Базовая ставка рассчитана на высоту 2,1 м; каждые +10 см — +2 % */
const REFERENCE_HEIGHT_M = 2.1;
const HEIGHT_FACTOR_PER_M = 0.2;
const INCLUDED_DOORS = 1;
const INCLUDED_VENTS = 1;
const EXTRA_DOOR_PRICE = 2500;
const EXTRA_VENT_PRICE = 1500;
const ROUND_TO = 100;

export type PriceLine = {
  id: string;
  label: string;
  amount: number;
};

export type PriceBreakdown = {
  lines: PriceLine[];
  total: number;
};

const roundPrice = (value: number) => Math.ceil(value / ROUND_TO) * ROUND_TO;

export function getExtraOptionPrice(option: ExtraOption, config: GreenhouseConfig): number {
  return roundPrice(option.price(config));
}

export function calculatePrice(config: GreenhouseConfig): PriceBreakdown {
  const area = config.widthM * config.lengthM;
  const heightFactor = 1 + (config.heightM - REFERENCE_HEIGHT_M) * HEIGHT_FACTOR_PER_M;
  const frame = getFrameOption(config.frame);
  const poly = POLYCARBONATE_OPTIONS.find((p) => p.mm === config.polycarbonateMm);
  const extraDoors = Math.max(0, config.doors - INCLUDED_DOORS);
  const extraVents = Math.max(0, config.vents - INCLUDED_VENTS);

  const lines: PriceLine[] = [
    {
      id: 'base',
      label: `Теплица ${config.widthM}×${config.lengthM} м, 1 дверь и 1 форточка`,
      amount: roundPrice(area * BASE_RATE_PER_M2[config.shape] * heightFactor),
    },
    {
      id: 'frame',
      label: `Каркас ${FRAME_PROFILE_LABELS[config.frame]}`,
      amount: roundPrice(frame.pricePerMeter * config.lengthM),
    },
    {
      id: 'polycarbonate',
      label: `Поликарбонат ${config.polycarbonateMm} мм`,
      amount: roundPrice((poly?.pricePerM2 ?? 0) * area),
    },
    { id: 'doors', label: 'Вторая дверь', amount: extraDoors * EXTRA_DOOR_PRICE },
    { id: 'vents', label: `Доп. форточки × ${extraVents}`, amount: extraVents * EXTRA_VENT_PRICE },
    ...EXTRA_OPTIONS.filter((o) => config.options.includes(o.id)).map((o) => ({
      id: o.id,
      label: o.label,
      amount: getExtraOptionPrice(o, config),
    })),
  ].filter((line) => line.id === 'base' || line.amount > 0);

  return { lines, total: lines.reduce((sum, line) => sum + line.amount, 0) };
}

/**
 * Доплата за вариант относительно текущей конфигурации — для подписей «+2 800 ₽» у опций.
 * Учитывает автоподстройку (например, усиление каркаса под 8 мм поликарбонат).
 */
export function getPriceDelta(config: GreenhouseConfig, patch: Partial<GreenhouseConfig>): number {
  const next = normalizeConfig({ ...config, ...patch }).config;
  return calculatePrice(next).total - calculatePrice(config).total;
}
