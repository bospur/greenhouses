import { z } from 'zod';
import { getMaxVents, isFrameAllowed } from './constraints';
import { LENGTH_RANGE, SHAPE_LIMITS } from './options';
import { EXTRA_OPTION_IDS, FRAME_IDS, POLYCARBONATE_MM, type GreenhouseConfig } from './types';

const inRange = (value: number, { min, max }: { min: number; max: number }) => value >= min && value <= max;

/** Только типы и форматы — без взаимных ограничений; их чинит `normalizeConfig` */
export const configShapeSchema = z.object({
  shape: z.enum(['arch', 'drop', 'gable']),
  widthM: z.number(),
  lengthM: z.number().int('Длина — целое число секций'),
  heightM: z.number(),
  frame: z.enum(FRAME_IDS),
  polycarbonateMm: z.literal(POLYCARBONATE_MM),
  doors: z.literal([1, 2]),
  vents: z.number().int().min(0),
  options: z.array(z.enum(EXTRA_OPTION_IDS)),
}) satisfies z.ZodType<GreenhouseConfig>;

export const configSchema = configShapeSchema.superRefine((c, ctx) => {
  if (!inRange(c.lengthM, LENGTH_RANGE)) {
    ctx.addIssue({
      code: 'custom',
      path: ['lengthM'],
      message: `Длина: от ${LENGTH_RANGE.min} до ${LENGTH_RANGE.max} м`,
    });
  }
  const limits = SHAPE_LIMITS[c.shape];
  if (!inRange(c.widthM, limits.width)) {
    ctx.addIssue({
      code: 'custom',
      path: ['widthM'],
      message: `Ширина: от ${limits.width.min} до ${limits.width.max} м`,
    });
  }
  if (!inRange(c.heightM, limits.height)) {
    ctx.addIssue({
      code: 'custom',
      path: ['heightM'],
      message: `Высота: от ${limits.height.min} до ${limits.height.max} м`,
    });
  }
  if (c.vents > getMaxVents(c.lengthM)) {
    ctx.addIssue({ code: 'custom', path: ['vents'], message: `Не больше ${getMaxVents(c.lengthM)} форточек` });
  }
  if (!isFrameAllowed(c.frame, c)) {
    ctx.addIssue({ code: 'custom', path: ['frame'], message: 'Каркас не выдержит такую конфигурацию' });
  }
}) satisfies z.ZodType<GreenhouseConfig>;
