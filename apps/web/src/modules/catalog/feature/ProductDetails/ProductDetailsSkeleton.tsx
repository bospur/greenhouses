import { Skeleton } from '@/shared/ui';
import styles from './ProductDetails.module.css';

export function ProductDetailsSkeleton() {
  return (
    <div aria-busy="true" aria-label="Загрузка модели">
      <Skeleton height={14} width={240} className={styles.skeletonCrumbs} />
      <div className={styles.top}>
        <div>
          <Skeleton height={400} radius={18} />
          <Skeleton height={76} className={styles.skeletonThumbs} />
        </div>
        <div className={styles.skeletonInfo}>
          <Skeleton height={24} width={180} radius={999} />
          <Skeleton height={36} width="80%" />
          <Skeleton height={16} width="60%" />
          <Skeleton height={40} width="45%" />
          <Skeleton height={72} />
          <Skeleton height={48} width="70%" />
        </div>
      </div>
    </div>
  );
}
