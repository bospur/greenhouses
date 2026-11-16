export { SHAPE_LABELS, formatFootprint, getFootprintArea, getDiscountPercent } from './labels';
export { WALL_RATIO, profilePath, getSectionCount } from './profile';
export { buildIllustration, ILLUSTRATION_VIEWBOX } from './illustration';
export type { GreenhouseIllustrationGeometry } from './illustration';
export { buildProductDrawing, splitVents } from './drawing';
export type { DimensionLine, DrawingOpenings, DrawingView, DrawingViewId, ProductDrawingGeometry } from './drawing';
export { buildSpecRows } from './specs';
export type { SpecRow } from './specs';
export {
  CATALOG_SORT_OPTIONS,
  DEFAULT_CATALOG_FILTERS,
  PRICE_STEP,
  applyCatalogFilters,
  getCatalogFacets,
  hasActiveFilters,
  parseCatalogFilters,
  toCatalogSearchParams,
} from './filters';
export type { CatalogFacets, CatalogFilters, CatalogSort } from './filters';
