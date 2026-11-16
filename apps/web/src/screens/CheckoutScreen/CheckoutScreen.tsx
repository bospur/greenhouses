import { Checkout } from '@/modules/checkout';
import { Container, PageMeta, SectionHeading } from '@/shared/ui';
import styles from './CheckoutScreen.module.css';

export function CheckoutScreen() {
  return (
    <Container className={styles.page}>
      <PageMeta title="Оформление заказа" noIndex />
      <SectionHeading as="h1" tag="Заказ" title="Оформление заказа" className={styles.heading} />
      <Checkout />
    </Container>
  );
}
