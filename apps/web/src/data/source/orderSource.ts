import { ENV } from '@/shared/config/env';
import { axiosInstance } from './axiosInstance';
import type { DeliveryServiceNetwork } from './deliverySource';
import { createMockOrder, createMockPayment, getMockOrder } from './mock/orderMock';
import { mockRequest } from './mock/mockRequest';

export type CustomGreenhouseNetworkDTO = {
  shape: 'arch' | 'drop' | 'gable';
  widthM: number;
  lengthM: number;
  heightM: number;
  frame: string;
  polycarbonateMm: number;
  doors: number;
  vents: number;
  options: string[];
};

export type OrderItemNetworkDTO =
  | { kind: 'product'; slug: string }
  | { kind: 'custom'; config: CustomGreenhouseNetworkDTO };

export type PaymentMethodNetwork = 'sbp' | 'card';

export type CreateOrderNetworkDTO = {
  item: OrderItemNetworkDTO;
  delivery: { cityId: string; quoteId: string; address: string | null };
  contact: { name: string; phone: string; email: string | null };
  comment: string | null;
  paymentMethod: PaymentMethodNetwork;
  /** что видел покупатель; сервер пересчитывает цену и сообщает, если она изменилась */
  clientPreview: { title: string; goodsRub: number };
};

export type OrderStatusNetwork = 'awaiting_payment' | 'paid' | 'shipped' | 'delivered' | 'cancelled';

export type PaymentStatusNetwork = 'pending' | 'succeeded' | 'canceled';

export type PaymentNetworkDTO = {
  id: string;
  status: PaymentStatusNetwork;
  method: PaymentMethodNetwork;
  amountRub: number;
  /** СБП: ссылка для QR-кода */
  qrPayload: string | null;
  /** карта: страница оплаты ЮKassa */
  confirmationUrl: string | null;
  expiresAt: string;
};

export type OrderNetworkDTO = {
  id: string;
  number: string;
  status: OrderStatusNetwork;
  createdAt: string;
  item: OrderItemNetworkDTO;
  itemTitle: string;
  goodsRub: number;
  deliveryRub: number;
  totalRub: number;
  delivery: {
    cityName: string;
    carrierName: string;
    service: DeliveryServiceNetwork;
    address: string | null;
    etaDaysMin: number;
    etaDaysMax: number;
  };
  contact: { name: string; phone: string; email: string | null };
  comment: string | null;
  paymentMethod: PaymentMethodNetwork;
  payment: PaymentNetworkDTO | null;
};

export async function postOrder(body: CreateOrderNetworkDTO): Promise<OrderNetworkDTO> {
  if (ENV.useMocks) {
    return mockRequest(() => createMockOrder(body), 700, 1200);
  }
  const { data } = await axiosInstance.post<OrderNetworkDTO>('/api/v1/orders', body);
  return data;
}

export async function fetchOrder(orderId: string): Promise<OrderNetworkDTO> {
  if (ENV.useMocks) {
    return mockRequest(() => getMockOrder(orderId), 200, 400);
  }
  const { data } = await axiosInstance.get<OrderNetworkDTO>(`/api/v1/orders/${encodeURIComponent(orderId)}`);
  return data;
}

export async function postOrderPayment(orderId: string): Promise<PaymentNetworkDTO> {
  if (ENV.useMocks) {
    return mockRequest(() => createMockPayment(orderId), 400, 800);
  }
  const { data } = await axiosInstance.post<PaymentNetworkDTO>(`/api/v1/orders/${encodeURIComponent(orderId)}/payment`);
  return data;
}
