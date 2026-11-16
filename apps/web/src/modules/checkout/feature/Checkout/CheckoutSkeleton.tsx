import { Skeleton } from '@/shared/ui';
import styles from './Checkout.module.css';

export function CheckoutSkeleton() {
  return (
    <div className={styles.skeleton} aria-busy="true" aria-label="Загрузка оформления">
      <div className={styles.skeletonColumn}>
        <Skeleton height={36} width={360} radius={999} />
        <Skeleton height={220} radius={18} />
        <Skeleton height={260} radius={18} />
      </div>
      <div className={styles.skeletonColumn}>
        <Skeleton height={300} radius={18} />
        <Skeleton height={220} radius={18} />
      </div>
    </div>
  );
}
