import type { CreateOrderNetworkDTO, OrderNetworkDTO, PaymentNetworkDTO } from '../orderSource';
import { CATALOG_MOCK } from './catalogMock';
import { findIssuedMockQuote } from './deliveryMock';
import { MockNotFoundError } from './mockRequest';

/** Заказы живут в localStorage, чтобы страница заказа переживала перезагрузку */
const STORAGE_KEY = 'greenhouses-mock-orders';
/** Через сколько «банк» подтверждает оплату — чтобы было видно смену статуса при опросе */
const MOCK_PAYMENT_CONFIRM_MS = 10_000;
const PAYMENT_TTL_MS = 15 * 60_000;

type MockOrder = OrderNetworkDTO & { paymentCreatedAt?: number };

function readOrders(): Record<string, MockOrder> {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}') as Record<string, MockOrder>;
  } catch {
    return {};
  }
}

function saveOrder(order: MockOrder) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...readOrders(), [order.id]: order }));
}

const randomDigits = (length: number) =>
  Array.from({ length }, (_, i) => Math.floor(Math.random() * (i === 0 ? 9 : 10)) + (i === 0 ? 1 : 0)).join('');

function resolveGoods(body: CreateOrderNetworkDTO): { title: string; goodsRub: number } {
  if (body.item.kind === 'custom') return body.clientPreview;
  const { slug } = body.item;
  const product = CATALOG_MOCK.find((p) => p.slug === slug);
  if (!product) throw new Error('Модель снята с продажи — выберите другую');
  const size = (mm: number) => (mm / 1000).toLocaleString('ru-RU');
  return {
    title: `«${product.name}» ${size(product.widthMm)}×${size(product.lengthMm)} м`,
    goodsRub: product.priceRub,
  };
}

export function createMockOrder(body: CreateOrderNetworkDTO): OrderNetworkDTO {
  const issued = findIssuedMockQuote(body.delivery.cityId, body.delivery.quoteId);
  if (!issued) throw new Error('Стоимость доставки устарела — выберите способ доставки ещё раз');

  const { quote, city } = issued;
  const goods = resolveGoods(body);
  const id = randomDigits(6);
  const order: MockOrder = {
    id,
    number: id,
    status: 'awaiting_payment',
    createdAt: new Date().toISOString(),
    item: body.item,
    itemTitle: goods.title,
    goodsRub: goods.goodsRub,
    deliveryRub: quote.costRub,
    totalRub: goods.goodsRub + quote.costRub,
    delivery: {
      cityName: city.name,
      carrierName: quote.carrierName,
      service: quote.service,
      address: quote.service === 'door' ? body.delivery.address : null,
      etaDaysMin: quote.etaDaysMin,
      etaDaysMax: quote.etaDaysMax,
    },
    contact: body.contact,
    comment: body.comment,
    paymentMethod: body.paymentMethod,
    payment: null,
  };
  saveOrder(order);
  return order;
}

/** Имитация вебхука ЮKassa: платёж подтверждается сам через несколько секунд или сгорает */
function advance(order: MockOrder): MockOrder {
  const { payment, paymentCreatedAt } = order;
  if (!payment || payment.status !== 'pending' || paymentCreatedAt === undefined) return order;
  const now = Date.now();
  if (now - paymentCreatedAt >= MOCK_PAYMENT_CONFIRM_MS) {
    return { ...order, status: 'paid', payment: { ...payment, status: 'succeeded' } };
  }
  if (now >= Date.parse(payment.expiresAt)) {
    return { ...order, payment: { ...payment, status: 'canceled' } };
  }
  return order;
}

function getStoredOrder(orderId: string): MockOrder {
  const stored = readOrders()[orderId];
  if (!stored) throw new MockNotFoundError('Заказ не найден');
  const order = advance(stored);
  if (order !== stored) saveOrder(order);
  return order;
}

export function getMockOrder(orderId: string): OrderNetworkDTO {
  const { paymentCreatedAt: _hidden, ...order } = getStoredOrder(orderId);
  return order;
}

export function createMockPayment(orderId: string): PaymentNetworkDTO {
  const order = getStoredOrder(orderId);
  if (order.status !== 'awaiting_payment') throw new Error('Заказ уже оплачен');
  if (order.payment?.status === 'pending') return order.payment;

  const now = Date.now();
  const paymentId = `pay_${randomDigits(10)}`;
  const payment: PaymentNetworkDTO = {
    id: paymentId,
    status: 'pending',
    method: order.paymentMethod,
    amountRub: order.totalRub,
    qrPayload: order.paymentMethod === 'sbp' ? `https://qr.nspk.ru/MOCK${paymentId}?sum=${order.totalRub * 100}` : null,
    confirmationUrl: null,
    expiresAt: new Date(now + PAYMENT_TTL_MS).toISOString(),
  };
  saveOrder({ ...order, payment, paymentCreatedAt: now });
  return payment;
}
