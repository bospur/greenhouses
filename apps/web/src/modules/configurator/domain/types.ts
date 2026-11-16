import type { GreenhouseShape } from '@/data/repositories/catalog';

export const FRAME_IDS = ['20x20', '40x20', '40x40', 'double'] as const;
export type FrameId = (typeof FRAME_IDS)[number];

export const POLYCARBONATE_MM = [4, 6, 8] as const;
export type PolycarbonateMm = (typeof POLYCARBONATE_MM)[number];

export const EXTRA_OPTION_IDS = ['autoVent', 'beds', 'base', 'install'] as const;
export type ExtraOptionId = (typeof EXTRA_OPTION_IDS)[number];

export type DoorsCount = 1 | 2;

export type GreenhouseConfig = {
  shape: GreenhouseShape;
  widthM: number;
  lengthM: number;
  heightM: number;
  frame: FrameId;
  polycarbonateMm: PolycarbonateMm;
  doors: DoorsCount;
  vents: number;
  options: ExtraOptionId[];
};
