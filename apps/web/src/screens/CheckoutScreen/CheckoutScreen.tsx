import { Checkout } from '@/modules/checkout';
import { COMPANY } from '@/shared/constants';
import { Container, SectionHeading } from '@/shared/ui';
import styles from './CheckoutScreen.module.css';

export function CheckoutScreen() {
  return (
    <Container className={styles.page}>
      <title>{`Оформление заказа — ${COMPANY.name}`}</title>
      <SectionHeading as="h1" tag="Заказ" title="Оформление заказа" className={styles.heading} />
      <Checkout />
    </Container>
  );
}
