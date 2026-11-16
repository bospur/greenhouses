import { Icon } from '@/shared/ui';
import type { GreenhouseConfig } from '../../domain';
import { ConfiguratorPreview } from './ConfiguratorPreview';
import { ExtrasStep } from './ExtrasStep';
import { MaterialsStep } from './MaterialsStep';
import { OpeningsStep } from './OpeningsStep';
import { MobilePriceBar, PriceSummary } from './PriceSummary';
import { SizeStep } from './SizeStep';
import { useConfiguratorFormLogic } from './useLogic';
import styles from './ConfiguratorForm.module.css';

type ConfiguratorFormProps = {
  initial: GreenhouseConfig;
  /** «Классик» 3×4 м — если конфигурация начата с модели каталога */
  baseLabel?: string;
};

export function ConfiguratorForm({ initial, baseLabel }: ConfiguratorFormProps) {
  const logic = useConfiguratorFormLogic(initial);

  return (
    <form className={styles.layout} onSubmit={logic.submit} noValidate>
      <div className={styles.steps}>
        {baseLabel && (
          <div className={styles.base}>
            <Icon name="ruler" size={18} />
            <span>
              За основу взята модель <strong>{baseLabel}</strong>
            </span>
            {logic.isModified && (
              <button type="button" className={styles.baseReset} onClick={logic.resetToInitial}>
                Вернуть параметры модели
              </button>
            )}
          </div>
        )}
        <SizeStep logic={logic} />
        <MaterialsStep logic={logic} />
        <OpeningsStep logic={logic} />
        <ExtrasStep logic={logic} />
        <PriceSummary logic={logic} />
      </div>

      <ConfiguratorPreview logic={logic} />
      <MobilePriceBar total={logic.price.total} />
    </form>
  );
}
