import type { GreenhouseShape } from '@/data/repositories/catalog';

/** Доля высоты прямой стенки торца до начала свода */
export const WALL_RATIO: Record<GreenhouseShape, number> = {
  arch: 0.28,
  drop: 0.3,
  gable: 0.6,
};

/**
 * SVG-path контура торца теплицы (открытый: без линии основания).
 * (x, y) — левый нижний угол, w/h — ширина и высота в единицах SVG, ось Y вниз.
 */
export function profilePath(shape: GreenhouseShape, x: number, y: number, w: number, h: number): string {
  const wall = h * WALL_RATIO[shape];
  switch (shape) {
    case 'arch':
      return `M${x} ${y} L${x} ${y - wall} A${w / 2} ${h - wall} 0 0 1 ${x + w} ${y - wall} L${x + w} ${y}`;
    case 'drop':
      return `M${x} ${y} L${x} ${y - wall} Q${x} ${y - h * 0.92} ${x + w / 2} ${y - h} Q${x + w} ${y - h * 0.92} ${x + w} ${y - wall} L${x + w} ${y}`;
    case 'gable':
      return `M${x} ${y} L${x} ${y - wall} L${x + w / 2} ${y - h} L${x + w} ${y - wall} L${x + w} ${y}`;
  }
}

/** Число пролётов между дугами: шаг ≈ 1 м, минимум 2 */
export function getSectionCount(lengthM: number): number {
  return Math.max(2, Math.round(lengthM));
}
