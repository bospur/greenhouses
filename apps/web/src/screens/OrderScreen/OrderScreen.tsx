import { useParams } from 'react-router';
import { OrderStatus } from '@/modules/checkout';
import { Container } from '@/shared/ui';
import styles from './OrderScreen.module.css';

export function OrderScreen() {
  const { orderId } = useParams<{ orderId: string }>();

  return (
    <Container className={styles.page}>
      <OrderStatus key={orderId} orderId={orderId} />
    </Container>
  );
}
