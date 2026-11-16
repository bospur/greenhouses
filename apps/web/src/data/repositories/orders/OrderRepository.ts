import { isAxiosError } from 'axios';
import { MockNotFoundError } from '@/data/source/mock/mockRequest';
import {
  fetchOrder,
  postOrder,
  postOrderPayment,
  type OrderNetworkDTO,
  type PaymentNetworkDTO,
} from '@/data/source/orderSource';
import { NotFoundError } from '@/shared/utils';
import type { CreateOrderInput, OrderDTO, PaymentDTO } from './dto';

function mapPaymentFromNetwork(row: PaymentNetworkDTO): PaymentDTO {
  return {
    id: row.id,
    status: row.status,
    method: row.method,
    amount: row.amountRub,
    qrPayload: row.qrPayload,
    confirmationUrl: row.confirmationUrl,
    expiresAt: row.expiresAt,
  };
}

function mapOrderFromNetwork(row: OrderNetworkDTO): OrderDTO {
  return {
    id: row.id,
    number: row.number,
    status: row.status,
    createdAt: row.createdAt,
    item: row.item,
    title: row.itemTitle,
    goods: row.goodsRub,
    total: row.totalRub,
    delivery: {
      cost: row.deliveryRub,
      cityName: row.delivery.cityName,
      carrierName: row.delivery.carrierName,
      service: row.delivery.service,
      address: row.delivery.address,
      etaDays: { min: row.delivery.etaDaysMin, max: row.delivery.etaDaysMax },
    },
    contact: row.contact,
    comment: row.comment,
    paymentMethod: row.paymentMethod,
    payment: row.payment ? mapPaymentFromNetwork(row.payment) : null,
  };
}

class OrderRepository {
  async createOrder(input: CreateOrderInput): Promise<OrderDTO> {
    const row = await postOrder({
      ...input,
      clientPreview: { title: input.clientPreview.title, goodsRub: input.clientPreview.goods },
    });
    return mapOrderFromNetwork(row);
  }

  async getOrder(orderId: string): Promise<OrderDTO> {
    try {
      return mapOrderFromNetwork(await fetchOrder(orderId));
    } catch (error) {
      if (error instanceof MockNotFoundError || (isAxiosError(error) && error.response?.status === 404)) {
        throw new NotFoundError('Заказ не найден');
      }
      throw error;
    }
  }

  async createPayment(orderId: string): Promise<PaymentDTO> {
    return mapPaymentFromNetwork(await postOrderPayment(orderId));
  }
}

export const orderRepository = new OrderRepository();
