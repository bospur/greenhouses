import { ProductDrawing, type DrawingViewId } from '@/modules/catalog';
import { Button, Icon } from '@/shared/ui';
import { formatPrice } from '@/shared/utils';
import type { ConfiguratorFormLogic } from './useLogic';
import styles from './summary.module.css';

const DRAWING_ROWS: readonly (readonly DrawingViewId[])[] = [['front', 'side'], ['top']];

export function ConfiguratorPreview({ logic }: { logic: ConfiguratorFormLogic }) {
  const { config } = logic;

  return (
    <aside className={styles.aside} aria-label="Чертёж">
      <section className={styles.card}>
        <div className={styles.head}>
          <h2 className={styles.title}>Предварительный чертёж</h2>
          <span className={styles.subtitle}>{logic.title}</span>
        </div>
        <ProductDrawing
          shape={config.shape}
          dimensions={logic.dimensions}
          doors={config.doors}
          vents={config.vents}
          rows={DRAWING_ROWS}
          className={styles.drawing}
        />
        <p className={styles.legend}>Размеры в метрах · пунктир — дуги каркаса · закрашено — форточки</p>

        <div className={styles.previewTotal}>
          <div className={styles.previewPrice}>
            <span>Итого</span>
            <strong>{formatPrice(logic.price.total)}</strong>
          </div>
          <Button type="submit">
            В заказ <Icon name="arrowRight" size={16} />
          </Button>
        </div>
      </section>
    </aside>
  );
}
