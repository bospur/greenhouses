import { ChoiceCard, Icon } from '@/shared/ui';
import { PAYMENT_METHOD_OPTIONS } from '../../domain';
import { CheckoutSection } from './CheckoutSection';
import type { CheckoutFormLogic } from './useLogic';
import styles from './CheckoutForm.module.css';

export function PaymentStep({ logic }: { logic: CheckoutFormLogic }) {
  const { form, values } = logic;

  return (
    <CheckoutSection index={3} title="Оплата" done={logic.progress.payment}>
      <div className={styles.choiceList} role="radiogroup" aria-label="Способ оплаты">
        {PAYMENT_METHOD_OPTIONS.map((option) => (
          <ChoiceCard
            key={option.id}
            name="payment-method"
            checked={values.paymentMethod === option.id}
            title={option.label}
            description={option.description}
            meta={<Icon name={option.id === 'sbp' ? 'qr' : 'card'} size={22} />}
            onChange={() => form.setValue('paymentMethod', option.id, { shouldDirty: true })}
          />
        ))}
      </div>
      <p className={styles.info}>
        <Icon name="shield" size={16} />
        Оплата — сразу после оформления. Платёж принимает ЮKassa, чек придёт на телефон или почту.
      </p>
    </CheckoutSection>
  );
}
