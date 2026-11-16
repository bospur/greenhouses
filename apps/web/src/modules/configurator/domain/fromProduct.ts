import type { ProductDTO } from '@/data/repositories/catalog';
import { normalizeConfig } from './constraints';
import { POLYCARBONATE_MM, type FrameId, type GreenhouseConfig, type PolycarbonateMm } from './types';

/** «2×40×20 мм, оцинковка» → 'double' и т. п.; неизвестный профиль — стандарт */
function frameFromProfile(profile: string): FrameId {
  if (/^2\s*×/.test(profile)) return 'double';
  if (profile.includes('40×40')) return '40x40';
  if (profile.includes('20×20')) return '20x20';
  return '40x20';
}

function nearestPolycarbonate(mm: number): PolycarbonateMm {
  return POLYCARBONATE_MM.reduce((best, v) => (Math.abs(v - mm) < Math.abs(best - mm) ? v : best));
}

export function configFromProduct(product: ProductDTO): GreenhouseConfig {
  return normalizeConfig({
    shape: product.shape,
    widthM: product.dimensions.widthM,
    lengthM: product.dimensions.lengthM,
    heightM: product.dimensions.heightM,
    frame: frameFromProfile(product.frameProfile),
    polycarbonateMm: nearestPolycarbonate(product.polycarbonateMm),
    doors: product.doors >= 2 ? 2 : 1,
    vents: product.vents,
    options: [],
  }).config;
}
