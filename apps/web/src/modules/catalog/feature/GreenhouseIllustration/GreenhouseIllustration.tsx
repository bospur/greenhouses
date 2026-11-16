import { useMemo } from 'react';
import type { GreenhouseShape, ProductDimensions } from '@/data/repositories/catalog';
import { buildIllustration, ILLUSTRATION_VIEWBOX } from '../../domain';
import styles from './GreenhouseIllustration.module.css';

type GreenhouseIllustrationProps = {
  shape: GreenhouseShape;
  dimensions: ProductDimensions;
  title?: string;
};

export function GreenhouseIllustration({ shape, dimensions, title }: GreenhouseIllustrationProps) {
  const g = useMemo(() => buildIllustration(shape, dimensions), [shape, dimensions]);

  return (
    <svg
      className={styles.svg}
      viewBox={`0 0 ${ILLUSTRATION_VIEWBOX.width} ${ILLUSTRATION_VIEWBOX.height}`}
      role="img"
      aria-label={title ?? 'Схема теплицы'}
    >
      <path d={g.ground} className={styles.ground} />
      <path d={g.back} className={styles.back} />
      {g.ribs.map((d, i) => (
        <path key={i} d={d} className={styles.rib} />
      ))}
      {g.rails.map((r, i) => (
        <line key={i} {...r} className={styles.rail} />
      ))}
      <path d={g.front} className={styles.front} />
      <rect {...g.door} className={styles.door} rx={1.5} />
    </svg>
  );
}
