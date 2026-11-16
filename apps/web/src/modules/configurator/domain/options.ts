import type { GreenhouseShape } from '@/data/repositories/catalog';
import type { ExtraOptionId, FrameId, GreenhouseConfig, PolycarbonateMm } from './types';

export type Range = { min: number; max: number; step: number };

export type ShapeLimits = {
  width: Range;
  height: Range;
  defaultHeightM: number;
};

export const SHAPE_ORDER: readonly GreenhouseShape[] = ['arch', 'drop', 'gable'];

export const SHAPE_DESCRIPTIONS: Record<GreenhouseShape, string> = {
  arch: 'Классика: простая сборка, лучшая цена',
  drop: 'Острый конёк — снег скатывается сам',
  gable: 'Прямые стены, удобно ставить стеллажи',
};

export const SHAPE_LIMITS: Record<GreenhouseShape, ShapeLimits> = {
  arch: { width: { min: 2, max: 4, step: 0.5 }, height: { min: 1.8, max: 2.5, step: 0.1 }, defaultHeightM: 2.1 },
  drop: { width: { min: 2.5, max: 4, step: 0.5 }, height: { min: 2.2, max: 2.8, step: 0.1 }, defaultHeightM: 2.4 },
  gable: { width: { min: 2.5, max: 6, step: 0.5 }, height: { min: 2.2, max: 3, step: 0.1 }, defaultHeightM: 2.5 },
};

/** Шаг длины = шаг дуг каркаса (одна секция) */
export const LENGTH_RANGE: Range = { min: 2, max: 12, step: 1 };

export type FrameOption = {
  id: FrameId;
  label: string;
  description: string;
  snowLoadKgM2: number;
  /** доплата за погонный метр длины */
  pricePerMeter: number;
};

export const FRAME_OPTIONS: readonly FrameOption[] = [
  { id: '20x20', label: 'Лёгкий 20×20', description: 'Для южных регионов', snowLoadKgM2: 100, pricePerMeter: 0 },
  {
    id: '40x20',
    label: 'Стандарт 40×20',
    description: 'Оптимум для средней полосы',
    snowLoadKgM2: 180,
    pricePerMeter: 700,
  },
  {
    id: '40x40',
    label: 'Усиленный 40×40',
    description: 'Широкие и длинные теплицы',
    snowLoadKgM2: 250,
    pricePerMeter: 1400,
  },
  {
    id: 'double',
    label: 'Двойная дуга 2×40×20',
    description: 'Урал, Сибирь, снежные зимы',
    snowLoadKgM2: 300,
    pricePerMeter: 2200,
  },
];

export const FRAME_PROFILE_LABELS: Record<FrameId, string> = {
  '20x20': '20×20 мм',
  '40x20': '40×20 мм',
  '40x40': '40×40 мм',
  double: '2×40×20 мм',
};

export type PolycarbonateOption = {
  mm: PolycarbonateMm;
  description: string;
  /** доплата за м² площади основания */
  pricePerM2: number;
};

export const POLYCARBONATE_OPTIONS: readonly PolycarbonateOption[] = [
  { mm: 4, description: 'Стандарт для сезонной теплицы', pricePerM2: 0 },
  { mm: 6, description: 'Прочнее, лучше держит тепло', pricePerM2: 400 },
  { mm: 8, description: 'Для ранней рассады и снежных зим', pricePerM2: 800 },
];

export type ExtraOption = {
  id: ExtraOptionId;
  label: string;
  description: string;
  price: (config: GreenhouseConfig) => number;
};

export const EXTRA_OPTIONS: readonly ExtraOption[] = [
  {
    id: 'autoVent',
    label: 'Термопривод форточек',
    description: 'Открывает форточки сам при жаре',
    price: (c) => 2900 * c.vents,
  },
  {
    id: 'beds',
    label: 'Грядки из оцинковки',
    description: 'Две грядки вдоль теплицы',
    price: (c) => 900 * c.lengthM,
  },
  {
    id: 'base',
    label: 'Основание из бруса 100×100',
    description: 'Пропитанный брус по периметру',
    price: (c) => 450 * 2 * (c.widthM + c.lengthM),
  },
  {
    id: 'install',
    label: 'Монтаж «под ключ»',
    description: 'Соберём на участке за 1 день',
    price: (c) => 6000 + 400 * c.widthM * c.lengthM,
  },
];

export const DEFAULT_CONFIG: GreenhouseConfig = {
  shape: 'arch',
  widthM: 3,
  lengthM: 4,
  heightM: 2.1,
  frame: '40x20',
  polycarbonateMm: 4,
  doors: 2,
  vents: 2,
  options: [],
};
