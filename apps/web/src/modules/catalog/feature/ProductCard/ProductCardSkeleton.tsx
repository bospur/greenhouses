import { Skeleton } from '@/shared/ui';
import styles from './ProductCard.module.css';

export function ProductCardSkeleton() {
  return (
    <div className={styles.card} aria-hidden="true">
      <Skeleton height={200} radius={0} />
      <div className={styles.body}>
        <Skeleton height={22} width="60%" />
        <Skeleton height={14} width="85%" className={styles.tagline} />
        <Skeleton height={28} width="40%" className={styles.priceRow} />
        <div className={styles.actions}>
          <Skeleton height={36} />
          <Skeleton height={36} />
        </div>
      </div>
    </div>
  );
}
