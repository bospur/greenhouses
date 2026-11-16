import { NavLink } from 'react-router';
import { APP_ROUTES } from '@/shared/constants';
import { Icon } from '@/shared/ui';
import { cn } from '@/shared/utils';
import { useOrderDraftLinkLogic } from './useLogic';
import styles from './OrderDraftLink.module.css';

/** Значок заказа в шапке: показывает, что в черновике есть теплица */
export function OrderDraftLink() {
  const logic = useOrderDraftLinkLogic();

  return (
    <NavLink
      to={APP_ROUTES.checkout.path}
      className={({ isActive }) => cn(styles.link, isActive && styles.active)}
      aria-label={logic.label}
      title="Оформление заказа"
    >
      <Icon name="cart" size={22} />
      {logic.hasItem && (
        <span className={styles.badge} aria-hidden="true">
          1
        </span>
      )}
    </NavLink>
  );
}
