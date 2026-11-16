export { EXTRA_OPTION_IDS, FRAME_IDS, POLYCARBONATE_MM } from './types';
export type { DoorsCount, ExtraOptionId, FrameId, GreenhouseConfig, PolycarbonateMm } from './types';
export {
  DEFAULT_CONFIG,
  EXTRA_OPTIONS,
  FRAME_OPTIONS,
  FRAME_PROFILE_LABELS,
  LENGTH_RANGE,
  POLYCARBONATE_OPTIONS,
  SHAPE_DESCRIPTIONS,
  SHAPE_LIMITS,
  SHAPE_ORDER,
} from './options';
export type { ExtraOption, FrameOption, PolycarbonateOption, Range, ShapeLimits } from './options';
export {
  getFrameOption,
  getFrameRequirement,
  getMaxVents,
  getRangeValues,
  isFrameAllowed,
  normalizeConfig,
  snapToRange,
} from './constraints';
export type { FrameRequirement, NormalizeResult } from './constraints';
export { calculatePrice, getExtraOptionPrice, getPriceDelta } from './pricing';
export type { PriceBreakdown, PriceLine } from './pricing';
export { configSchema, configShapeSchema } from './schema';
export { configFromProduct } from './fromProduct';
export { parseConfigSearchParams, toConfigSearchParams } from './searchParams';
export { buildConfigSpecs, getConfigTitle, getSnowLoad } from './describe';
export type { ConfigSpec } from './describe';
