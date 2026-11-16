import { getFrameOption } from './constraints';
import { EXTRA_OPTIONS, FRAME_PROFILE_LABELS } from './options';
import type { GreenhouseConfig } from './types';

const SHAPE_SNOW_BONUS: Record<GreenhouseConfig['shape'], number> = { arch: 0, drop: 50, gable: 0 };

const TITLE_BY_SHAPE: Record<GreenhouseConfig['shape'], string> = {
  arch: 'Арочная теплица',
  drop: 'Каплевидная теплица',
  gable: 'Теплица-домик',
};

const num = (v: number) => v.toLocaleString('ru-RU', { maximumFractionDigits: 2 });

export function getConfigTitle(config: GreenhouseConfig): string {
  return `${TITLE_BY_SHAPE[config.shape]} ${num(config.widthM)}×${num(config.lengthM)} м`;
}

/** Оценка снеговой нагрузки по каркасу и форме — справочно, для подсказки покупателю */
export function getSnowLoad(config: GreenhouseConfig): number {
  return getFrameOption(config.frame).snowLoadKgM2 + SHAPE_SNOW_BONUS[config.shape];
}

export type ConfigSpec = { label: string; value: string };

export function buildConfigSpecs(config: GreenhouseConfig): ConfigSpec[] {
  const area = Math.round(config.widthM * config.lengthM * 100) / 100;
  const options = EXTRA_OPTIONS.filter((o) => config.options.includes(o.id)).map((o) => o.label);
  return [
    { label: 'Размеры (Ш×Д×В)', value: `${num(config.widthM)}×${num(config.lengthM)}×${num(config.heightM)} м` },
    { label: 'Площадь', value: `${num(area)} м²` },
    { label: 'Каркас', value: FRAME_PROFILE_LABELS[config.frame] },
    { label: 'Поликарбонат', value: `${config.polycarbonateMm} мм` },
    { label: 'Двери / форточки', value: `${config.doors} / ${config.vents}` },
    { label: 'Снеговая нагрузка', value: `до ${getSnowLoad(config)} кг/м²` },
    ...(options.length > 0 ? [{ label: 'Опции', value: options.join(', ') }] : []),
  ];
}
