import type { OrderItem, OrderItemSummary } from '../../domain';
import { CheckoutProgress } from './CheckoutProgress';
import { ContactsStep } from './ContactsStep';
import { DeliveryStep } from './DeliveryStep';
import { OrderItemCard } from './OrderItemCard';
import { OrderTotals } from './OrderTotals';
import { PaymentStep } from './PaymentStep';
import { useCheckoutFormLogic } from './useLogic';
import styles from './CheckoutForm.module.css';

type CheckoutFormProps = {
  item: OrderItem;
  summary: OrderItemSummary;
};

export function CheckoutForm({ item, summary }: CheckoutFormProps) {
  const logic = useCheckoutFormLogic(item, summary);

  return (
    <>
      <CheckoutProgress progress={logic.progress} />
      <form className={styles.layout} onSubmit={logic.submit} noValidate>
        <div className={styles.steps}>
          <DeliveryStep logic={logic} />
          <ContactsStep logic={logic} />
          <PaymentStep logic={logic} />
        </div>
        <aside className={styles.aside} aria-label="Сводка заказа">
          <OrderItemCard summary={summary} />
          <OrderTotals logic={logic} />
        </aside>
      </form>
    </>
  );
}
