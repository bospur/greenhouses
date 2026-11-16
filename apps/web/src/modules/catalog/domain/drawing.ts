import type { GreenhouseShape, ProductDimensions } from '@/data/repositories/catalog';
import { formatMeters } from '@/shared/utils';
import { WALL_RATIO, getSectionCount, profilePath } from './profile';

/** Пикселей SVG на метр — общий для обоих видов, чтобы пропорции совпадали */
const SCALE = 46;
const MARGIN_X = 52;
const MARGIN_TOP = 44;
const MARGIN_BOTTOM = 60;
const DIM_OFFSET = 26;
const DIM_LABEL_GAP = 12;
const DIM_EXT_OVERSHOOT = 5;
const TICK = 4;

const DOOR_WIDTH_M = 0.8;
const DOOR_HEIGHT_M = 1.8;
/** С форточкой над дверью дверь ниже, чтобы форточка уместилась под сводом */
const DOOR_HEIGHT_RATIO = 0.8;
const DOOR_HEIGHT_RATIO_WITH_VENT = 0.7;
const VENT_WIDTH_M = 0.5;
const VENT_HEIGHT_M = 0.35;
const VENT_GAP_M = 0.08;
const SIDE_VENT_WIDTH_M = 0.6;

/** Две форточки — на торцах (над дверью), остальные — на боковых скатах поочерёдно с двух сторон */
const END_VENTS_MAX = 2;

export type Point = { x: number; y: number };
export type Segment = { x1: number; y1: number; x2: number; y2: number };
export type Box = { x: number; y: number; width: number; height: number };

export type DimensionLine = {
  line: Segment;
  extensions: Segment[];
  /** засечки на концах размерной линии */
  ticks: string;
  label: string;
  labelAt: Point;
  vertical: boolean;
};

export type DrawingView = {
  title: string;
  titleAt: Point;
  viewBox: { width: number; height: number };
  outline: string;
  /** дуги / пролёты — тонкий пунктир */
  hidden: string[];
  /** осевые линии — штрихпунктир */
  axes: Segment[];
  /** двери */
  openings: Box[];
  vents: Box[];
  ground: Segment | null;
  dimensions: DimensionLine[];
};

export type DrawingViewId = 'front' | 'side' | 'top';

export type ProductDrawingGeometry = Record<DrawingViewId, DrawingView>;

export type DrawingOpenings = {
  doors: number;
  vents: number;
};

export function splitVents(vents: number): { end: number; side: number } {
  const end = Math.min(vents, END_VENTS_MAX);
  return { end, side: vents - end };
}

const tick = ({ x, y }: Point) => `M${x - TICK} ${y + TICK} L${x + TICK} ${y - TICK}`;

/** Горизонтальный размер между x1 и x2; base — кромка объекта, side: 1 — снизу, -1 — сверху */
function horizontalDimension(x1: number, x2: number, base: number, side: 1 | -1, label: string): DimensionLine {
  const y = base + side * DIM_OFFSET;
  const extEnd = y + side * DIM_EXT_OVERSHOOT;
  const extStart = base + side * 4;
  return {
    line: { x1, y1: y, x2, y2: y },
    extensions: [
      { x1, y1: extStart, x2: x1, y2: extEnd },
      { x1: x2, y1: extStart, x2, y2: extEnd },
    ],
    ticks: `${tick({ x: x1, y })} ${tick({ x: x2, y })}`,
    label,
    labelAt: { x: (x1 + x2) / 2, y: y + side * DIM_LABEL_GAP },
    vertical: false,
  };
}

/** Вертикальный размер между y1 и y2; base — кромка объекта, side: 1 — справа, -1 — слева */
function verticalDimension(y1: number, y2: number, base: number, side: 1 | -1, label: string): DimensionLine {
  const x = base + side * DIM_OFFSET;
  const extEnd = x + side * DIM_EXT_OVERSHOOT;
  const extStart = base + side * 4;
  return {
    line: { x1: x, y1, x2: x, y2 },
    extensions: [
      { x1: extStart, y1, x2: extEnd, y2: y1 },
      { x1: extStart, y1: y2, x2: extEnd, y2 },
    ],
    ticks: `${tick({ x, y: y1 })} ${tick({ x, y: y2 })}`,
    label,
    labelAt: { x: x + side * DIM_LABEL_GAP, y: (y1 + y2) / 2 },
    vertical: true,
  };
}

/** Центры форточек одного ската по длине: равномерно, в серединах пролётов */
function sideVentCenters(count: number, sections: number, x0: number, l: number): number[] {
  return Array.from({ length: count }, (_, i) => {
    const section = Math.floor(((i + 0.5) * sections) / count);
    return x0 + ((section + 0.5) * l) / sections;
  });
}

function sectionLines(sections: number, x0: number, l: number, yFrom: number, yTo: number): string[] {
  return Array.from({ length: sections - 1 }, (_, i) => {
    const x = x0 + (l * (i + 1)) / sections;
    return `M${x} ${yFrom} V${yTo}`;
  });
}

function buildFrontView(shape: GreenhouseShape, d: ProductDimensions, { doors, vents }: DrawingOpenings): DrawingView {
  const w = d.widthM * SCALE;
  const h = d.heightM * SCALE;
  const x0 = MARGIN_X;
  const y0 = MARGIN_TOP + h;
  const hasVent = splitVents(vents).end > 0;
  const doorW = Math.min(DOOR_WIDTH_M, d.widthM * 0.3) * SCALE;
  const doorRatio = hasVent ? DOOR_HEIGHT_RATIO_WITH_VENT : DOOR_HEIGHT_RATIO;
  const doorH = Math.min(DOOR_HEIGHT_M, d.heightM * doorRatio) * SCALE;
  const cx = x0 + w / 2;
  const ventW = VENT_WIDTH_M * SCALE;
  const ventH = VENT_HEIGHT_M * SCALE;

  return {
    title: 'Вид спереди (торец)',
    titleAt: { x: x0, y: 20 },
    viewBox: { width: w + MARGIN_X * 2, height: h + MARGIN_TOP + MARGIN_BOTTOM },
    outline: profilePath(shape, x0, y0, w, h),
    hidden: [],
    axes: [{ x1: cx, y1: y0 + 8, x2: cx, y2: y0 - h - 10 }],
    openings: doors > 0 ? [{ x: cx - doorW / 2, y: y0 - doorH, width: doorW, height: doorH }] : [],
    vents: hasVent
      ? [{ x: cx - ventW / 2, y: y0 - doorH - VENT_GAP_M * SCALE - ventH, width: ventW, height: ventH }]
      : [],
    ground: { x1: x0 - 18, y1: y0, x2: x0 + w + 18, y2: y0 },
    dimensions: [
      horizontalDimension(x0, x0 + w, y0, 1, formatMeters(d.widthM)),
      verticalDimension(y0, y0 - h, x0 + w, 1, formatMeters(d.heightM)),
    ],
  };
}

function buildSideView(shape: GreenhouseShape, d: ProductDimensions, { vents }: DrawingOpenings): DrawingView {
  const l = d.lengthM * SCALE;
  const h = d.heightM * SCALE;
  const x0 = MARGIN_X;
  const y0 = MARGIN_TOP + h;
  const wallM = Math.round(d.heightM * WALL_RATIO[shape] * 100) / 100;
  const wall = wallM * SCALE;
  const sections = getSectionCount(d.lengthM);
  const ventW = SIDE_VENT_WIDTH_M * SCALE;
  const ventH = VENT_HEIGHT_M * SCALE;
  const ventCy = y0 - wall - (h - wall) * 0.45;
  const visibleSideVents = Math.ceil(splitVents(vents).side / 2);

  return {
    title: 'Вид сбоку',
    titleAt: { x: x0, y: 20 },
    viewBox: { width: l + MARGIN_X * 2, height: h + MARGIN_TOP + MARGIN_BOTTOM },
    outline: `M${x0} ${y0} V${y0 - h} H${x0 + l} V${y0}`,
    hidden: [`M${x0} ${y0 - wall} H${x0 + l}`, ...sectionLines(sections, x0, l, y0, y0 - h)],
    axes: [],
    openings: [],
    vents: sideVentCenters(visibleSideVents, sections, x0, l).map((x) => ({
      x: x - ventW / 2,
      y: ventCy - ventH / 2,
      width: ventW,
      height: ventH,
    })),
    ground: { x1: x0 - 18, y1: y0, x2: x0 + l + 18, y2: y0 },
    dimensions: [
      horizontalDimension(x0, x0 + l, y0, 1, formatMeters(d.lengthM)),
      verticalDimension(y0, y0 - wall, x0, -1, formatMeters(wallM)),
    ],
  };
}

function buildTopView(d: ProductDimensions, { doors, vents }: DrawingOpenings): DrawingView {
  const l = d.lengthM * SCALE;
  const w = d.widthM * SCALE;
  const x0 = MARGIN_X;
  const y0 = MARGIN_TOP;
  const cy = y0 + w / 2;
  const sections = getSectionCount(d.lengthM);
  const doorW = Math.min(DOOR_WIDTH_M, d.widthM * 0.3) * SCALE;
  const door = (x: number): Box => ({ x: x - 3, y: cy - doorW / 2, width: 6, height: doorW });
  const side = splitVents(vents).side;
  const ventW = SIDE_VENT_WIDTH_M * SCALE;
  const ventH = Math.min(VENT_HEIGHT_M * SCALE, w * 0.2);
  const roofVent = (x: number, y: number): Box => ({ x: x - ventW / 2, y, width: ventW, height: ventH });

  return {
    title: 'Вид сверху',
    titleAt: { x: x0, y: 20 },
    viewBox: { width: l + MARGIN_X * 2, height: w + MARGIN_TOP + MARGIN_BOTTOM },
    outline: `M${x0} ${y0} h${l} v${w} h${-l} Z`,
    hidden: sectionLines(sections, x0, l, y0, y0 + w),
    axes: [{ x1: x0 - 10, y1: cy, x2: x0 + l + 10, y2: cy }],
    openings: doors >= 2 ? [door(x0), door(x0 + l)] : doors === 1 ? [door(x0)] : [],
    vents: [
      ...sideVentCenters(Math.ceil(side / 2), sections, x0, l).map((x) => roofVent(x, y0 + w * 0.72 - ventH / 2)),
      ...sideVentCenters(Math.floor(side / 2), sections, x0, l).map((x) => roofVent(x, y0 + w * 0.28 - ventH / 2)),
    ],
    ground: null,
    dimensions: [
      horizontalDimension(x0, x0 + l, y0 + w, 1, formatMeters(d.lengthM)),
      verticalDimension(y0 + w, y0, x0, -1, formatMeters(d.widthM)),
    ],
  };
}

export function buildProductDrawing(
  shape: GreenhouseShape,
  d: ProductDimensions,
  openings: DrawingOpenings,
): ProductDrawingGeometry {
  return {
    front: buildFrontView(shape, d, openings),
    side: buildSideView(shape, d, openings),
    top: buildTopView(d, openings),
  };
}
