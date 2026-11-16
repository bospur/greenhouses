import { Button, Icon } from '@/shared/ui';
import { formatPrice } from '@/shared/utils';
import type { CheckoutFormLogic } from './useLogic';
import styles from './aside.module.css';

export function OrderTotals({ logic }: { logic: CheckoutFormLogic }) {
  const { totals, summary } = logic;

  return (
    <section className={styles.totals} aria-labelledby="checkout-totals-title">
      <h2 id="checkout-totals-title" className={styles.title}>
        Ваш заказ
      </h2>
      <dl className={styles.lines}>
        <div className={styles.line}>
          <dt>Теплица</dt>
          <dd>
            {summary.oldPrice && <s className={styles.oldPrice}>{formatPrice(summary.oldPrice)}</s>}
            {formatPrice(totals.goods)}
          </dd>
        </div>
        <div className={styles.line}>
          <dt>Доставка</dt>
          <dd>
            {totals.delivery === null ? (
              <span className={styles.pending}>выберите способ</span>
            ) : totals.delivery === 0 ? (
              'Бесплатно'
            ) : (
              formatPrice(totals.delivery)
            )}
          </dd>
        </div>
      </dl>
      <div className={styles.total}>
        <span>Итого</span>
        <output aria-live="polite">{formatPrice(totals.total)}</output>
      </div>

      {logic.submitError && (
        <p className={styles.submitError} role="alert">
          <Icon name="alert" size={16} />
          {logic.submitError}
        </p>
      )}
      <Button type="submit" size="lg" block className={styles.submit} disabled={logic.isSubmitting}>
        {logic.isSubmitting ? 'Оформляем…' : 'Оформить и оплатить'}
        {!logic.isSubmitting && <Icon name="arrowRight" size={18} />}
      </Button>
      <p className={styles.note}>
        Цена предварительная — менеджер подтвердит её звонком. Нажимая кнопку, вы соглашаетесь на обработку
        персональных данных.
      </p>
    </section>
  );
}
