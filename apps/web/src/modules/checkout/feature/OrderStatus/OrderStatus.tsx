import { Link } from 'react-router';
import type { OrderDTO } from '@/data/repositories/orders';
import { APP_ROUTES, COMPANY } from '@/shared/constants';
import { Button, ErrorState, Icon, Skeleton } from '@/shared/ui';
import { cn, formatDateTime, formatPrice } from '@/shared/utils';
import {
  DELIVERY_SERVICE_LABELS,
  ORDER_STATUS_LABELS,
  PAYMENT_METHOD_LABELS,
  formatEta,
  formatPhoneInput,
} from '../../domain';
import { PaymentDialog } from './PaymentDialog';
import { useOrderStatusLogic } from './useLogic';
import styles from './OrderStatus.module.css';

const BADGE_CLASS: Record<OrderDTO['status'], string> = {
  awaiting_payment: styles.badgeWaiting,
  paid: styles.badgeOk,
  shipped: styles.badgeOk,
  delivered: styles.badgeOk,
  cancelled: styles.badgeCancelled,
};

export function OrderStatus({ orderId }: { orderId: string | undefined }) {
  const logic = useOrderStatusLogic(orderId);
  const { order } = logic;

  if (logic.isLoading) return <OrderStatusSkeleton />;
  if (logic.isNotFound) return <OrderNotFound />;
  if (!order) return <ErrorState message={logic.errorMessage ?? 'Не удалось загрузить заказ'} onRetry={logic.retry} />;

  const { delivery, contact } = order;

  return (
    <div className={styles.page}>
      <title>{`Заказ № ${order.number} — ${COMPANY.name}`}</title>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Заказ № {order.number}</h1>
          <p className={styles.meta}>Оформлен {formatDateTime(order.createdAt)}</p>
        </div>
        <span className={cn(styles.badge, BADGE_CLASS[order.status])}>{ORDER_STATUS_LABELS[order.status]}</span>
      </header>

      {logic.timeline.length > 0 && (
        <ol className={styles.timeline} aria-label="Этапы заказа">
          {logic.timeline.map((step) => (
            <li
              key={step.id}
              className={cn(styles.timelineStep, styles[step.state])}
              aria-current={step.state === 'current' ? 'step' : undefined}
            >
              <span className={styles.dot} aria-hidden="true">
                {step.state === 'done' && <Icon name="check" size={12} strokeWidth={3} />}
              </span>
              {step.label}
            </li>
          ))}
        </ol>
      )}

      {logic.canPay ? (
        <section className={cn(styles.callout, styles.calloutPay)}>
          <div>
            <h2 className={styles.calloutTitle}>Заказ ждёт оплаты</h2>
            <p className={styles.calloutText}>
              {PAYMENT_METHOD_LABELS[order.paymentMethod]} · {formatPrice(order.total)}
              {order.payment?.status === 'pending' && ' · платёж создан, ждём подтверждение банка'}
            </p>
          </div>
          <Button onClick={logic.openPayment} size="lg">
            Оплатить <Icon name="arrowRight" size={18} />
          </Button>
        </section>
      ) : (
        order.status === 'paid' && (
          <section className={cn(styles.callout, styles.calloutPaid)} role="status">
            <Icon name="shield" size={22} />
            <p className={styles.calloutText}>
              Оплата получена. Менеджер позвонит в течение рабочего дня, чтобы согласовать отгрузку.
            </p>
          </section>
        )
      )}

      <div className={styles.grid}>
        <section className={styles.card}>
          <h2 className={styles.cardTitle}>
            <Icon name="package" size={18} /> Теплица
          </h2>
          <p className={styles.strong}>{order.title}</p>
          {logic.itemLink && (
            <Link to={logic.itemLink.href} className={styles.link}>
              {logic.itemLink.label}
            </Link>
          )}
        </section>

        <section className={styles.card}>
          <h2 className={styles.cardTitle}>
            <Icon name="truck" size={18} /> Доставка
          </h2>
          <p className={styles.strong}>
            {delivery.carrierName} · {DELIVERY_SERVICE_LABELS[delivery.service].toLowerCase()}
          </p>
          <p className={styles.text}>
            {delivery.address ? `${delivery.cityName}, ${delivery.address}` : `г. ${delivery.cityName}`}
          </p>
          <p className={styles.text}>Срок — {formatEta(delivery.etaDays)} после отгрузки</p>
        </section>

        <section className={styles.card}>
          <h2 className={styles.cardTitle}>
            <Icon name="user" size={18} /> Получатель
          </h2>
          <p className={styles.strong}>{contact.name}</p>
          <p className={styles.text}>{formatPhoneInput(contact.phone)}</p>
          {contact.email && <p className={styles.text}>{contact.email}</p>}
          {order.comment && <p className={styles.comment}>«{order.comment}»</p>}
        </section>

        <section className={styles.card}>
          <h2 className={styles.cardTitle}>
            <Icon name="card" size={18} /> Сумма
          </h2>
          <dl className={styles.lines}>
            <div>
              <dt>Теплица</dt>
              <dd>{formatPrice(order.goods)}</dd>
            </div>
            <div>
              <dt>Доставка</dt>
              <dd>{delivery.cost === 0 ? 'Бесплатно' : formatPrice(delivery.cost)}</dd>
            </div>
            <div className={styles.total}>
              <dt>Итого</dt>
              <dd>{formatPrice(order.total)}</dd>
            </div>
          </dl>
        </section>
      </div>

      <p className={styles.help}>
        Вопросы по заказу — <a href={COMPANY.phoneHref}>{COMPANY.phone}</a>, {COMPANY.workHours.toLowerCase()}.
      </p>

      <PaymentDialog order={order} state={logic.payment} />
    </div>
  );
}

function OrderStatusSkeleton() {
  return (
    <div className={styles.page} aria-busy="true" aria-label="Загрузка заказа">
      <Skeleton height={44} width={320} />
      <Skeleton height={48} radius={999} />
      <Skeleton height={96} radius={18} />
      <div className={styles.grid}>
        {[0, 1, 2, 3].map((i) => (
          <Skeleton key={i} height={150} radius={18} />
        ))}
      </div>
    </div>
  );
}

function OrderNotFound() {
  return (
    <div className={styles.notFound}>
      <title>{`Заказ не найден — ${COMPANY.name}`}</title>
      <h1 className={styles.title}>Заказ не найден</h1>
      <p className={styles.text}>Проверьте ссылку или позвоните нам: {COMPANY.phone}</p>
      <Button to={APP_ROUTES.catalog.path}>В каталог</Button>
    </div>
  );
}
