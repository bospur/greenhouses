import { Button, Icon } from '@/shared/ui';
import { formatPrice } from '@/shared/utils';
import type { ConfiguratorFormLogic } from './useLogic';
import styles from './summary.module.css';

export function PriceSummary({ logic }: { logic: ConfiguratorFormLogic }) {
  const { price } = logic;

  return (
    <section className={styles.summary} aria-labelledby="config-price-title">
      <h2 id="config-price-title" className={styles.title}>
        Ваша теплица
      </h2>
      <p className={styles.subtitle}>{logic.title}</p>

      <dl className={styles.specs}>
        {logic.specs.map((s) => (
          <div key={s.label} className={styles.specRow}>
            <dt>{s.label}</dt>
            <dd>{s.value}</dd>
          </div>
        ))}
      </dl>

      <dl className={styles.lines}>
        {price.lines.map((line) => (
          <div key={line.id} className={styles.line}>
            <dt>{line.label}</dt>
            <dd>{formatPrice(line.amount)}</dd>
          </div>
        ))}
      </dl>
      <div className={styles.total}>
        <span>Итого</span>
        <output aria-live="polite">{formatPrice(price.total)}</output>
      </div>

      <Button type="submit" size="lg" block className={styles.submit}>
        Перейти к оформлению <Icon name="arrowRight" size={18} />
      </Button>
      <p className={styles.note}>
        <Icon name="truck" size={16} />
        Цена предварительная — менеджер подтвердит её после заказа. Доставку рассчитаем на следующем шаге.
      </p>
    </section>
  );
}

export function MobilePriceBar({ total }: { total: number }) {
  return (
    <div className={styles.mobileBar}>
      <div className={styles.mobilePrice}>
        <span>Итого</span>
        <strong>{formatPrice(total)}</strong>
      </div>
      <Button type="submit">
        В заказ <Icon name="arrowRight" size={16} />
      </Button>
    </div>
  );
}
