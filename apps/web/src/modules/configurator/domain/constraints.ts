import { formatMeters } from '@/shared/utils';
import { FRAME_OPTIONS, FRAME_PROFILE_LABELS, LENGTH_RANGE, SHAPE_LIMITS, type Range } from './options';
import type { FrameId, GreenhouseConfig } from './types';

const FRAME_RANK: Record<FrameId, number> = { '20x20': 0, '40x20': 1, '40x40': 2, double: 3 };

export type FrameRequirement = { frame: FrameId; reason: string };

const roundTo = (value: number, step: number) => Math.round(value / step) * step;
const clamp = (value: number, { min, max }: Range) => Math.min(Math.max(value, min), max);
/** Значение в диапазоне и на сетке шага; округление до 2 знаков убирает хвосты float */
export const snapToRange = (value: number, range: Range) =>
  Math.round(clamp(roundTo(value, range.step), range) * 100) / 100;

export function getRangeValues({ min, max, step }: Range): number[] {
  const count = Math.round((max - min) / step) + 1;
  return Array.from({ length: count }, (_, i) => Math.round((min + i * step) * 100) / 100);
}

/** Две форточки на торцах + одна на каждые 2 м длины */
export function getMaxVents(lengthM: number): number {
  return 2 + Math.floor(lengthM / 2);
}

/** Минимальный каркас, который выдержит выбранную конфигурацию, и почему */
export function getFrameRequirement(config: GreenhouseConfig): FrameRequirement | null {
  const rules: (FrameRequirement & { when: boolean })[] = [
    { when: config.widthM > 3, frame: '40x20', reason: 'теплице шире 3 м' },
    { when: config.lengthM > 8, frame: '40x20', reason: 'теплице длиннее 8 м' },
    { when: config.polycarbonateMm === 8, frame: '40x20', reason: 'поликарбонату 8 мм' },
    { when: config.shape === 'gable', frame: '40x20', reason: 'форме «домик»' },
    { when: config.widthM > 4, frame: '40x40', reason: 'теплице шире 4 м' },
  ];
  return rules
    .filter((r) => r.when)
    .reduce<FrameRequirement | null>(
      (best, r) => (!best || FRAME_RANK[r.frame] > FRAME_RANK[best.frame] ? { frame: r.frame, reason: r.reason } : best),
      null,
    );
}

export function isFrameAllowed(frame: FrameId, config: GreenhouseConfig): boolean {
  const req = getFrameRequirement(config);
  return !req || FRAME_RANK[frame] >= FRAME_RANK[req.frame];
}

export type NormalizeResult = {
  config: GreenhouseConfig;
  /** человекочитаемые пояснения, что поменяли автоматически */
  adjustments: string[];
};

/** Приводит конфигурацию к допустимой: размеры в пределах формы, каркас не слабее требуемого, форточки в лимите */
export function normalizeConfig(input: GreenhouseConfig): NormalizeResult {
  const limits = SHAPE_LIMITS[input.shape];
  const config: GreenhouseConfig = {
    ...input,
    widthM: snapToRange(input.widthM, limits.width),
    lengthM: snapToRange(input.lengthM, LENGTH_RANGE),
    heightM: snapToRange(input.heightM, limits.height),
  };
  const adjustments: string[] = [];

  if (config.widthM !== input.widthM) adjustments.push(`Ширина изменена на ${formatMeters(config.widthM)} — предел для этой формы`);
  if (config.heightM !== input.heightM) adjustments.push(`Высота изменена на ${formatMeters(config.heightM)} — предел для этой формы`);

  const req = getFrameRequirement(config);
  if (req && FRAME_RANK[config.frame] < FRAME_RANK[req.frame]) {
    config.frame = req.frame;
    adjustments.push(`Каркас усилен до ${FRAME_PROFILE_LABELS[req.frame]} — он нужен ${req.reason}`);
  }

  const maxVents = getMaxVents(config.lengthM);
  if (config.vents > maxVents) {
    config.vents = maxVents;
    adjustments.push(`Форточек — не больше ${maxVents} для такой длины`);
  }
  config.vents = Math.max(0, Math.round(config.vents));

  if (config.vents === 0 && config.options.includes('autoVent')) {
    config.options = config.options.filter((id) => id !== 'autoVent');
    adjustments.push('Термопривод убран — в теплице нет форточек');
  }

  return { config, adjustments };
}

export function getFrameOption(id: FrameId) {
  return FRAME_OPTIONS.find((f) => f.id === id) ?? FRAME_OPTIONS[0];
}
