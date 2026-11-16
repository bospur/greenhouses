import { Stepper } from '@/shared/ui';
import { formatPriceDelta } from '@/shared/utils';
import type { DoorsCount } from '../../domain';
import { ChoiceChips } from './ChoiceChips';
import { ConfigStep, Field } from './ConfigStep';
import type { ConfiguratorFormLogic } from './useLogic';
import controls from './controls.module.css';

const VENTS_ID = 'config-vents';

export function OpeningsStep({ logic }: { logic: ConfiguratorFormLogic }) {
  const { config, maxVents } = logic;
  const doorOptions = ([1, 2] as const).map((value: DoorsCount) => {
    const delta = formatPriceDelta(logic.priceDelta({ doors: value }));
    return { value, label: `${value === 1 ? '1 торец' : '2 торца'}${delta ? ` (${delta})` : ''}` };
  });

  return (
    <ConfigStep index={3} title="Двери и форточки" notice={logic.noticeFor('openings')}>
      <div className={controls.row}>
        <Field label="Двери" hint="Дверь 0,8 × 1,8 м с ручкой и запором">
          <ChoiceChips
            name="doors"
            label="Двери"
            options={doorOptions}
            value={config.doors}
            onChange={logic.setDoors}
          />
        </Field>

        <Field
          label="Форточки"
          htmlFor={VENTS_ID}
          hint={`Две — на торцах, остальные на скатах; до ${maxVents} для такой длины`}
        >
          <Stepper
            id={VENTS_ID}
            label="Форточки"
            value={config.vents}
            min={0}
            max={maxVents}
            format={(v) => `${v} шт.`}
            onChange={logic.setVents}
          />
        </Field>
      </div>
    </ConfigStep>
  );
}
