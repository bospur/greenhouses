import { Link } from 'react-router';
import { ProductDrawing, type DrawingViewId } from '@/modules/catalog';
import { Icon } from '@/shared/ui';
import type { OrderItemSummary } from '../../domain';
import styles from './aside.module.css';

const DRAWING_ROWS: readonly (readonly DrawingViewId[])[] = [['front', 'side']];

export function OrderItemCard({ summary }: { summary: OrderItemSummary }) {
  return (
    <section className={styles.card} aria-labelledby="checkout-item-title">
      <div className={styles.cardHead}>
        <div>
          <h2 id="checkout-item-title" className={styles.title}>
            {summary.title}
          </h2>
          <p className={styles.subtitle}>{summary.subtitle}</p>
        </div>
        <Link to={summary.edit.href} className={styles.edit}>
          <Icon name="sliders" size={16} />
          {summary.edit.label}
        </Link>
      </div>
      <ProductDrawing {...summary.drawing} rows={DRAWING_ROWS} className={styles.drawing} />
      <dl className={styles.specs}>
        {summary.specs.map((s) => (
          <div key={s.label} className={styles.specRow}>
            <dt>{s.label}</dt>
            <dd>{s.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
