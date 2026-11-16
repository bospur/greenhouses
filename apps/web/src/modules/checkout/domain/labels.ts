import type { DeliveryService } from '@/data/repositories/delivery';
import type { OrderStatus, PaymentMethod } from '@/data/repositories/orders';
import { pluralize } from '@/shared/utils';

export const DELIVERY_SERVICE_LABELS: Record<DeliveryService, string> = {
  door: 'Курьером до участка',
  terminal: 'До терминала ТК',
  pickup: 'Со склада',
};

/** «1–2 дня», «5–7 дней» */
export function formatEta({ min, max }: { min: number; max: number }): string {
  const range = min === max ? `${min}` : `${min}–${max}`;
  return `${range} ${pluralize(max, ['день', 'дня', 'дней'])}`;
}

export type PaymentMethodOption = { id: PaymentMethod; label: string; description: string };

export const PAYMENT_METHOD_OPTIONS: readonly PaymentMethodOption[] = [
  { id: 'sbp', label: 'СБП по QR-коду', description: 'В приложении любого банка, без комиссии' },
  { id: 'card', label: 'Банковская карта', description: 'МИР, Visa, Mastercard — на защищённой странице ЮKassa' },
];

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  sbp: 'СБП',
  card: 'Банковская карта',
};

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  awaiting_payment: 'Ожидает оплаты',
  paid: 'Оплачен',
  shipped: 'Передан в транспортную компанию',
  delivered: 'Доставлен',
  cancelled: 'Отменён',
};

export type TimelineStep = { id: string; label: string; state: 'done' | 'current' | 'upcoming' };

const TIMELINE: readonly { id: string; label: string; reachedAt: OrderStatus[] }[] = [
  { id: 'created', label: 'Заказ оформлен', reachedAt: ['awaiting_payment', 'paid', 'shipped', 'delivered'] },
  { id: 'paid', label: 'Оплачен', reachedAt: ['paid', 'shipped', 'delivered'] },
  { id: 'shipped', label: 'Передан в ТК', reachedAt: ['shipped', 'delivered'] },
  { id: 'delivered', label: 'Доставлен', reachedAt: ['delivered'] },
];

export function buildOrderTimeline(status: OrderStatus): TimelineStep[] {
  if (status === 'cancelled') return [];
  const reached = TIMELINE.map((s) => s.reachedAt.includes(status));
  const current = reached.indexOf(false);
  return TIMELINE.map((s, i) => ({
    id: s.id,
    label: s.label,
    state: reached[i] ? 'done' : i === current ? 'current' : 'upcoming',
  }));
}
