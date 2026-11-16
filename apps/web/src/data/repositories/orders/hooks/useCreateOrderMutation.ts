import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { CreateOrderInput } from '../dto';
import { orderRepository } from '../OrderRepository';
import { orderKeys } from '../queryKeys';

export function useCreateOrderMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateOrderInput) => orderRepository.createOrder(input),
    onSuccess: (order) => queryClient.setQueryData(orderKeys.order(order.id), order),
  });
}
