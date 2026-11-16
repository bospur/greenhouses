import { APP_ROUTES } from '@/shared/constants';
import { Button, Icon } from '@/shared/ui';
import styles from './Checkout.module.css';

export function EmptyCheckout({ title, text }: { title: string; text: string }) {
  return (
    <div className={styles.empty}>
      <span className={styles.emptyIcon}>
        <Icon name="cart" size={28} />
      </span>
      <h2 className={styles.emptyTitle}>{title}</h2>
      <p className={styles.emptyText}>{text}</p>
      <div className={styles.emptyActions}>
        <Button to={APP_ROUTES.catalog.path}>Перейти в каталог</Button>
        <Button to={APP_ROUTES.configurator.path} variant="outline">
          Собрать свою
        </Button>
      </div>
    </div>
  );
}
