import type { GreenhouseShape } from '../catalog/dto';
import type { DeliveryService } from '../delivery/dto';

/** Своя конфигурация в контракте заказа — структурно совместима с `GreenhouseConfig` конфигуратора */
export type CustomGreenhouseDTO = {
  shape: GreenhouseShape;
  widthM: number;
  lengthM: number;
  heightM: number;
  frame: string;
  polycarbonateMm: number;
  doors: number;
  vents: number;
  options: string[];
};

export type OrderItemDTO = { kind: 'product'; slug: string } | { kind: 'custom'; config: CustomGreenhouseDTO };

export type PaymentMethod = 'sbp' | 'card';

export type OrderStatus = 'awaiting_payment' | 'paid' | 'shipped' | 'delivered' | 'cancelled';

export type PaymentStatus = 'pending' | 'succeeded' | 'canceled';

export type PaymentDTO = {
  id: string;
  status: PaymentStatus;
  method: PaymentMethod;
  amount: number;
  qrPayload: string | null;
  confirmationUrl: string | null;
  expiresAt: string;
};

export type OrderContactDTO = {
  name: string;
  phone: string;
  email: string | null;
};

export type OrderDTO = {
  id: string;
  number: string;
  status: OrderStatus;
  createdAt: string;
  item: OrderItemDTO;
  title: string;
  goods: number;
  total: number;
  delivery: {
    cost: number;
    cityName: string;
    carrierName: string;
    service: DeliveryService;
    address: string | null;
    etaDays: { min: number; max: number };
  };
  contact: OrderContactDTO;
  comment: string | null;
  paymentMethod: PaymentMethod;
  payment: PaymentDTO | null;
};

export type CreateOrderInput = {
  item: OrderItemDTO;
  delivery: { cityId: string; quoteId: string; address: string | null };
  contact: OrderContactDTO;
  comment: string | null;
  paymentMethod: PaymentMethod;
  clientPreview: { title: string; goods: number };
};
