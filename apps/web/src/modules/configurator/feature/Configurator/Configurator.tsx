import { ConfiguratorForm } from '../ConfiguratorForm';
import { ConfiguratorSkeleton } from './ConfiguratorSkeleton';
import { useConfiguratorLogic } from './useLogic';
import styles from './Configurator.module.css';

export function Configurator() {
  const logic = useConfiguratorLogic();

  if (logic.isLoading) return <ConfiguratorSkeleton />;

  return (
    <>
      {logic.fallbackNotice && (
        <p className={styles.fallback} role="status">
          {logic.fallbackNotice}
        </p>
      )}
      <ConfiguratorForm key={logic.formKey} initial={logic.initial} baseLabel={logic.baseLabel} />
    </>
  );
}
