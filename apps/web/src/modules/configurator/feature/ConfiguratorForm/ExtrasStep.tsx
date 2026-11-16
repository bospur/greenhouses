import { formatPrice } from '@/shared/utils';
import { ChoiceCard } from '@/shared/ui';
import { EXTRA_OPTIONS, getExtraOptionPrice } from '../../domain';
import { ConfigStep } from './ConfigStep';
import type { ConfiguratorFormLogic } from './useLogic';
import controls from './controls.module.css';

export function ExtrasStep({ logic }: { logic: ConfiguratorFormLogic }) {
  const { config } = logic;

  return (
    <ConfigStep index={4} title="Дополнительно" notice={logic.noticeFor('extras')}>
      <div className={controls.cardGrid} role="group" aria-label="Дополнительные опции">
        {EXTRA_OPTIONS.map((o) => {
          const unavailable = o.id === 'autoVent' && config.vents === 0;
          return (
            <ChoiceCard
              key={o.id}
              size="sm"
              type="checkbox"
              name="options"
              checked={config.options.includes(o.id)}
              disabled={unavailable}
              title={o.label}
              description={unavailable ? 'Добавьте хотя бы одну форточку' : o.description}
              meta={unavailable ? null : formatPrice(getExtraOptionPrice(o, config))}
              onChange={() => logic.toggleOption(o.id)}
            />
          );
        })}
      </div>
    </ConfigStep>
  );
}
