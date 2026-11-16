import { formatPriceDelta } from '@/shared/utils';
import { FRAME_OPTIONS, FRAME_PROFILE_LABELS, POLYCARBONATE_OPTIONS, isFrameAllowed } from '../../domain';
import { ConfigStep, Field } from './ConfigStep';
import { OptionCard } from './OptionCard';
import type { ConfiguratorFormLogic } from './useLogic';
import controls from './controls.module.css';

export function MaterialsStep({ logic }: { logic: ConfiguratorFormLogic }) {
  const { config, frameRequirement } = logic;

  return (
    <ConfigStep index={2} title="Каркас и покрытие" notice={logic.noticeFor('materials')}>
      <Field
        label="Каркас"
        hint={
          frameRequirement
            ? `Минимум ${FRAME_PROFILE_LABELS[frameRequirement.frame]} — он нужен ${frameRequirement.reason}`
            : 'Оцинкованная профильная труба'
        }
      >
        <div className={controls.cardList} role="radiogroup" aria-label="Каркас">
          {FRAME_OPTIONS.map((f) => (
            <OptionCard
              key={f.id}
              type="radio"
              name="frame"
              checked={config.frame === f.id}
              disabled={!isFrameAllowed(f.id, config)}
              title={f.label}
              description={`${f.description} · до ${f.snowLoadKgM2} кг/м²`}
              meta={formatPriceDelta(logic.priceDelta({ frame: f.id }))}
              onChange={() => logic.setFrame(f.id)}
            />
          ))}
        </div>
      </Field>

      <Field label="Сотовый поликарбонат">
        <div className={controls.cardGrid} role="radiogroup" aria-label="Толщина поликарбоната">
          {POLYCARBONATE_OPTIONS.map((p) => (
            <OptionCard
              key={p.mm}
              type="radio"
              name="polycarbonate"
              checked={config.polycarbonateMm === p.mm}
              title={`${p.mm} мм`}
              description={p.description}
              meta={formatPriceDelta(logic.priceDelta({ polycarbonateMm: p.mm }))}
              onChange={() => logic.setPolycarbonate(p.mm)}
            />
          ))}
        </div>
      </Field>
    </ConfigStep>
  );
}
