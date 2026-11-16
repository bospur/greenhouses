import type { GreenhouseShape, ProductDimensions } from '@/data/repositories/catalog';
import { getSectionCount, profilePath } from './profile';

export const ILLUSTRATION_VIEWBOX = { width: 240, height: 160 } as const;

/** Наклон «глубины» (длины теплицы) в аксонометрии */
const DEPTH_X = 0.5;
const DEPTH_Y = 0.28;
const PADDING = 18;

export type GreenhouseIllustrationGeometry = {
  front: string;
  back: string;
  ribs: string[];
  /** линии вдоль длины: основания и конёк/верх */
  rails: Array<{ x1: number; y1: number; x2: number; y2: number }>;
  door: { x: number; y: number; width: number; height: number };
  ground: string;
};

export function buildIllustration(shape: GreenhouseShape, d: ProductDimensions): GreenhouseIllustrationGeometry {
  const { width: vw, height: vh } = ILLUSTRATION_VIEWBOX;
  const scale = Math.min(
    (vw - PADDING * 2) / (d.widthM + d.lengthM * DEPTH_X),
    (vh - PADDING * 2) / (d.heightM + d.lengthM * DEPTH_Y),
  );

  const w = d.widthM * scale;
  const h = d.heightM * scale;
  const dx = d.lengthM * DEPTH_X * scale;
  const dy = d.lengthM * DEPTH_Y * scale;

  const totalW = w + dx;
  const totalH = h + dy;
  const x0 = (vw - totalW) / 2;
  const y0 = (vh + totalH) / 2;

  const sections = getSectionCount(d.lengthM);
  const ribs: string[] = [];
  for (let i = 1; i < sections; i++) {
    const t = i / sections;
    ribs.push(profilePath(shape, x0 + dx * t, y0 - dy * t, w, h));
  }

  const doorW = Math.min(w * 0.26, 0.8 * scale);
  const doorH = Math.min(h * 0.82, 1.8 * scale);

  return {
    front: profilePath(shape, x0, y0, w, h),
    back: profilePath(shape, x0 + dx, y0 - dy, w, h),
    ribs,
    rails: [
      { x1: x0, y1: y0, x2: x0 + dx, y2: y0 - dy },
      { x1: x0 + w, y1: y0, x2: x0 + w + dx, y2: y0 - dy },
      { x1: x0 + w / 2, y1: y0 - h, x2: x0 + w / 2 + dx, y2: y0 - h - dy },
    ],
    door: { x: x0 + (w - doorW) / 2, y: y0 - doorH, width: doorW, height: doorH },
    ground: `M${x0 - 10} ${y0 + 4} L${x0 + w + 10} ${y0 + 4} L${x0 + w + dx + 10} ${y0 - dy - 4} L${x0 + dx - 10} ${y0 - dy - 4} Z`,
  };
}
