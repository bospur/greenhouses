import { useQuery } from '@tanstack/react-query';
import { ORDER_PAYMENT_POLL_MS } from '@/shared/constants';
import { isNotFoundError } from '@/shared/utils';
import { orderRepository } from '../OrderRepository';
import { orderKeys } from '../queryKeys';

/** Пока платёж в ожидании — опрашиваем статус (вебхук ЮKassa обновляет заказ на сервере) */
export function useOrderQuery(orderId: string | undefined) {
  return useQuery({
    queryKey: orderKeys.order(orderId ?? ''),
    queryFn: () => orderRepository.getOrder(orderId!),
    enabled: Boolean(orderId),
    retry: (failureCount, error) => !isNotFoundError(error) && failureCount < 1,
    refetchInterval: (query) => (query.state.data?.payment?.status === 'pending' ? ORDER_PAYMENT_POLL_MS : false),
  });
}
