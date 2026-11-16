import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { OrderDTO } from '../dto';
import { orderRepository } from '../OrderRepository';
import { orderKeys } from '../queryKeys';

export function useCreatePaymentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderId: string) => orderRepository.createPayment(orderId),
    onSuccess: (payment, orderId) => {
      queryClient.setQueryData<OrderDTO>(orderKeys.order(orderId), (order) => (order ? { ...order, payment } : order));
      return queryClient.invalidateQueries({ queryKey: orderKeys.order(orderId) });
    },
  });
}
