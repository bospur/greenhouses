import { Skeleton } from '@/shared/ui';
import styles from './Configurator.module.css';

export function ConfiguratorSkeleton() {
  return (
    <div className={styles.skeleton} aria-busy="true" aria-label="Загрузка конфигуратора">
      <div className={styles.skeletonColumn}>
        <Skeleton height={340} radius={18} />
        <Skeleton height={260} radius={18} />
      </div>
      <div className={styles.skeletonColumn}>
        <Skeleton height={380} radius={18} />
        <Skeleton height={220} radius={18} />
      </div>
    </div>
  );
}
