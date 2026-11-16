import { useMemo } from 'react';
import type { OrderDTO } from '@/data/repositories/orders';
import { ENV } from '@/shared/config/env';
import { Button, Icon, Modal, Skeleton } from '@/shared/ui';
import { formatPrice, formatTime } from '@/shared/utils';
import { buildMockQrPath } from '../../domain';
import type { OrderStatusLogic } from './useLogic';
import styles from './PaymentDialog.module.css';

type PaymentDialogProps = {
  order: OrderDTO;
  state: OrderStatusLogic['payment'];
};

export function PaymentDialog({ order, state }: PaymentDialogProps) {
  const { payment } = order;
  const isPaid = order.status !== 'awaiting_payment';

  return (
    <Modal open={state.open} onClose={state.onClose} title={isPaid ? 'Оплата прошла' : `Оплата заказа № ${order.number}`}>
      {isPaid ? (
        <PaidContent onClose={state.onClose} />
      ) : state.isCreating ? (
        <div className={styles.content} aria-busy="true">
          <p className={styles.text}>Создаём платёж…</p>
          <Skeleton height={220} width={220} radius={12} className={styles.qr} />
        </div>
      ) : state.error ? (
        <div className={styles.content}>
          <p className={styles.errorText} role="alert">
            {state.error}
          </p>
          <Button onClick={state.retry}>Попробовать снова</Button>
        </div>
      ) : payment?.status === 'pending' ? (
        <div className={styles.content}>
          {payment.method === 'sbp' && payment.qrPayload ? (
            <>
              <p className={styles.text}>Отсканируйте QR-код камерой телефона или в приложении банка</p>
              <MockQr payload={payment.qrPayload} />
            </>
          ) : (
            <>
              <p className={styles.text}>Оплата картой проходит на защищённой странице ЮKassa</p>
              {payment.confirmationUrl && (
                <Button to={payment.confirmationUrl} size="lg" block>
                  Перейти к оплате <Icon name="arrowRight" size={18} />
                </Button>
              )}
            </>
          )}
          <strong className={styles.amount}>{formatPrice(payment.amount)}</strong>
          <p className={styles.waiting} role="status">
            <span className={styles.spinner} aria-hidden="true" />
            Ждём подтверждение от банка · ссылка действует до {formatTime(payment.expiresAt)}
          </p>
          {ENV.useMocks && (
            <p className={styles.mockNote}>Тестовый режим: оплата подтвердится сама через ~10 секунд.</p>
          )}
        </div>
      ) : (
        <div className={styles.content}>
          <p className={styles.text}>Время на оплату истекло. Создайте новый платёж — сумма не изменится.</p>
          <Button onClick={state.retry}>Создать платёж</Button>
        </div>
      )}
    </Modal>
  );
}

function MockQr({ payload }: { payload: string }) {
  const qr = useMemo(() => buildMockQrPath(payload), [payload]);
  return (
    <svg
      className={styles.qr}
      viewBox={`-2 -2 ${qr.size + 4} ${qr.size + 4}`}
      shapeRendering="crispEdges"
      role="img"
      aria-label="QR-код для оплаты через СБП"
    >
      <rect x={-2} y={-2} width={qr.size + 4} height={qr.size + 4} fill="#fff" />
      <path d={qr.path} fill="#111827" />
    </svg>
  );
}

function PaidContent({ onClose }: { onClose: () => void }) {
  return (
    <div className={styles.content}>
      <span className={styles.success}>
        <Icon name="check" size={32} strokeWidth={2.5} />
      </span>
      <p className={styles.text}>
        Спасибо! Менеджер позвонит в течение рабочего дня, чтобы согласовать отгрузку. Чек придёт на телефон или
        почту.
      </p>
      <Button onClick={onClose} block>
        Готово
      </Button>
    </div>
  );
}
