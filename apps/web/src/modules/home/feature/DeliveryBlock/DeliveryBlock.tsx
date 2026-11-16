import { APP_ROUTES } from '@/shared/constants';
import { Button, Container, Icon, Reveal } from '@/shared/ui';
import { DELIVERY_CONTENT } from '../../domain';
import styles from './DeliveryBlock.module.css';

export function DeliveryBlock() {
  return (
    <section className={styles.section}>
      <Container>
        <Reveal className={styles.block}>
          <div className={styles.icon}>
            <Icon name="truck" size={32} />
          </div>
          <div>
            <h2 className={styles.title}>{DELIVERY_CONTENT.title}</h2>
            <p className={styles.text}>{DELIVERY_CONTENT.text}</p>
            <ul className={styles.carriers}>
              {DELIVERY_CONTENT.carriers.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </div>
          <Button to={APP_ROUTES.checkout.path} variant="outline">
            Рассчитать доставку <Icon name="arrowRight" size={18} />
          </Button>
        </Reveal>
      </Container>
    </section>
  );
}
