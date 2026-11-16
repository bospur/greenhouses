import { normalizeConfig } from './constraints';
import { configShapeSchema } from './schema';
import type { GreenhouseConfig } from './types';

/** Короткие ключи: ссылка на конфигурацию остаётся читаемой (`/checkout?shape=arch&w=3&l=4…`) */
const KEYS = {
  shape: 'shape',
  widthM: 'w',
  lengthM: 'l',
  heightM: 'h',
  frame: 'frame',
  polycarbonateMm: 'poly',
  doors: 'doors',
  vents: 'vents',
  options: 'opt',
} as const satisfies Record<keyof GreenhouseConfig, string>;

export function toConfigSearchParams(config: GreenhouseConfig): URLSearchParams {
  const params = new URLSearchParams({
    [KEYS.shape]: config.shape,
    [KEYS.widthM]: String(config.widthM),
    [KEYS.lengthM]: String(config.lengthM),
    [KEYS.heightM]: String(config.heightM),
    [KEYS.frame]: config.frame,
    [KEYS.polycarbonateMm]: String(config.polycarbonateMm),
    [KEYS.doors]: String(config.doors),
    [KEYS.vents]: String(config.vents),
  });
  if (config.options.length > 0) params.set(KEYS.options, config.options.join(','));
  return params;
}

/** null — в параметрах нет конфигурации; выход за ограничения не ошибка — значения приводятся к допустимым */
export function parseConfigSearchParams(params: URLSearchParams): GreenhouseConfig | null {
  const num = (key: string) => (params.has(key) ? Number(params.get(key)) : NaN);
  const parsed = configShapeSchema.safeParse({
    shape: params.get(KEYS.shape),
    widthM: num(KEYS.widthM),
    lengthM: num(KEYS.lengthM),
    heightM: num(KEYS.heightM),
    frame: params.get(KEYS.frame),
    polycarbonateMm: num(KEYS.polycarbonateMm),
    doors: num(KEYS.doors),
    vents: num(KEYS.vents),
    options: params.get(KEYS.options)?.split(',').filter(Boolean) ?? [],
  });
  if (!parsed.success) return null;
  return normalizeConfig(parsed.data).config;
}
