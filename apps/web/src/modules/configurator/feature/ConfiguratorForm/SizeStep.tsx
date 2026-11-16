import type { GreenhouseShape, ProductDimensions } from '@/data/repositories/catalog';
import { GreenhouseIllustration, SHAPE_LABELS } from '@/modules/catalog';
import { ChoiceCard, Stepper } from '@/shared/ui';
import { formatMeters, pluralize } from '@/shared/utils';
import { LENGTH_RANGE, SHAPE_DESCRIPTIONS, SHAPE_LIMITS, SHAPE_ORDER, getRangeValues } from '../../domain';
import { ChoiceChips } from './ChoiceChips';
import { ConfigStep, Field } from './ConfigStep';
import type { ConfiguratorFormLogic } from './useLogic';
import controls from './controls.module.css';

const PREVIEW_DIMENSIONS: Record<GreenhouseShape, ProductDimensions> = {
  arch: { widthM: 3, lengthM: 4, heightM: SHAPE_LIMITS.arch.defaultHeightM },
  drop: { widthM: 3, lengthM: 4, heightM: SHAPE_LIMITS.drop.defaultHeightM },
  gable: { widthM: 3, lengthM: 4, heightM: SHAPE_LIMITS.gable.defaultHeightM },
};

const LENGTH_ID = 'config-length';
const HEIGHT_ID = 'config-height';

export function SizeStep({ logic }: { logic: ConfiguratorFormLogic }) {
  const { config } = logic;
  const limits = SHAPE_LIMITS[config.shape];
  const widthOptions = getRangeValues(limits.width).map((w) => ({ value: w, label: formatMeters(w) }));
  const area = Math.round(config.widthM * config.lengthM * 100) / 100;

  return (
    <ConfigStep index={1} title="Форма и размеры" notice={logic.noticeFor('size')}>
      <Field label="Форма">
        <div className={controls.shapeGrid} role="radiogroup" aria-label="Форма теплицы">
          {SHAPE_ORDER.map((shape) => (
            <ChoiceCard
              key={shape}
              size="sm"
              type="radio"
              name="shape"
              checked={config.shape === shape}
              title={SHAPE_LABELS[shape]}
              description={SHAPE_DESCRIPTIONS[shape]}
              media={<GreenhouseIllustration shape={shape} dimensions={PREVIEW_DIMENSIONS[shape]} />}
              onChange={() => logic.setShape(shape)}
            />
          ))}
        </div>
      </Field>

      <Field
        label="Ширина"
        hint={`Для этой формы — от ${formatMeters(limits.width.min)} до ${formatMeters(limits.width.max)}`}
      >
        <ChoiceChips
          name="width"
          label="Ширина"
          options={widthOptions}
          value={config.widthM}
          onChange={logic.setWidth}
        />
      </Field>

      <div className={controls.row}>
        <Field
          label="Длина"
          htmlFor={LENGTH_ID}
          hint={`${config.lengthM} ${pluralize(config.lengthM, ['секция', 'секции', 'секций'])} по 1 м · площадь ${area.toLocaleString('ru-RU')} м²`}
        >
          <Stepper
            id={LENGTH_ID}
            label="Длина"
            value={config.lengthM}
            min={LENGTH_RANGE.min}
            max={LENGTH_RANGE.max}
            step={LENGTH_RANGE.step}
            format={formatMeters}
            onChange={logic.setLength}
          />
        </Field>

        <Field
          label="Высота в коньке"
          htmlFor={HEIGHT_ID}
          hint={`${formatMeters(limits.height.min)} — ${formatMeters(limits.height.max)}`}
        >
          <div className={controls.range}>
            <input
              id={HEIGHT_ID}
              type="range"
              min={limits.height.min}
              max={limits.height.max}
              step={limits.height.step}
              value={config.heightM}
              onChange={(e) => logic.setHeight(Number(e.target.value))}
              aria-valuetext={formatMeters(config.heightM)}
            />
            <output htmlFor={HEIGHT_ID} className={controls.rangeValue}>
              {formatMeters(config.heightM)}
            </output>
          </div>
        </Field>
      </div>
    </ConfigStep>
  );
}
