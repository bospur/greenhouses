import { useMemo, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router';
import { APP_ROUTES } from '@/shared/constants';
import {
  buildConfigSpecs,
  calculatePrice,
  configSchema,
  getConfigTitle,
  getFrameRequirement,
  getMaxVents,
  getPriceDelta,
  normalizeConfig,
  toConfigSearchParams,
  type GreenhouseConfig,
} from '../../domain';

export type ConfigStepId = 'size' | 'materials' | 'openings' | 'extras';

/** Что поменяли автоматически после правки пользователя — показываем у шага, где была правка */
type AdjustmentNotice = { step: ConfigStepId; messages: string[] };

export function useConfiguratorFormLogic(initial: GreenhouseConfig) {
  const navigate = useNavigate();
  const form = useForm<GreenhouseConfig>({
    defaultValues: initial,
    resolver: zodResolver(configSchema),
    mode: 'onChange',
  });
  const config = useWatch({ control: form.control }) as GreenhouseConfig;
  const [notice, setNotice] = useState<AdjustmentNotice | null>(null);

  const update = (step: ConfigStepId, patch: Partial<GreenhouseConfig>) => {
    const result = normalizeConfig({ ...form.getValues(), ...patch });
    form.reset(result.config, { keepDefaultValues: true });
    setNotice(result.adjustments.length > 0 ? { step, messages: result.adjustments } : null);
  };

  const derived = useMemo(
    () => ({
      title: getConfigTitle(config),
      price: calculatePrice(config),
      specs: buildConfigSpecs(config),
      frameRequirement: getFrameRequirement(config),
      maxVents: getMaxVents(config.lengthM),
      dimensions: { widthM: config.widthM, lengthM: config.lengthM, heightM: config.heightM },
    }),
    [config],
  );

  const submit = form.handleSubmit((values) => {
    navigate(APP_ROUTES.checkout.withConfig(toConfigSearchParams(values).toString()));
  });

  return {
    config,
    ...derived,
    noticeFor: (step: ConfigStepId) => (notice?.step === step ? notice.messages : []),
    priceDelta: (patch: Partial<GreenhouseConfig>) => getPriceDelta(config, patch),
    isModified: form.formState.isDirty,

    setShape: (shape: GreenhouseConfig['shape']) => update('size', { shape }),
    setWidth: (widthM: number) => update('size', { widthM }),
    setLength: (lengthM: number) => update('size', { lengthM }),
    setHeight: (heightM: number) => update('size', { heightM }),
    setFrame: (frame: GreenhouseConfig['frame']) => update('materials', { frame }),
    setPolycarbonate: (polycarbonateMm: GreenhouseConfig['polycarbonateMm']) =>
      update('materials', { polycarbonateMm }),
    setDoors: (doors: GreenhouseConfig['doors']) => update('openings', { doors }),
    setVents: (vents: number) => update('openings', { vents }),
    toggleOption: (id: GreenhouseConfig['options'][number]) =>
      update('extras', {
        options: config.options.includes(id) ? config.options.filter((o) => o !== id) : [...config.options, id],
      }),
    resetToInitial: () => {
      form.reset(initial);
      setNotice(null);
    },
    submit,
  };
}

export type ConfiguratorFormLogic = ReturnType<typeof useConfiguratorFormLogic>;
