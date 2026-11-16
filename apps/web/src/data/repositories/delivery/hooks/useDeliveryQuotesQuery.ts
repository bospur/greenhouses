import { useQuery } from '@tanstack/react-query';
import { DELIVERY_QUOTES_LIFETIME_MS } from '@/shared/constants';
import { deliveryRepository } from '../DeliveryRepository';
import type { CargoDTO } from '../dto';
import { deliveryKeys } from '../queryKeys';

export function useDeliveryQuotesQuery(cityId: string | undefined, cargo: CargoDTO | null) {
  return useQuery({
    queryKey: deliveryKeys.quotes(cityId ?? '', cargo),
    queryFn: () => deliveryRepository.getQuotes(cityId!, cargo!),
    enabled: Boolean(cityId && cargo),
    staleTime: DELIVERY_QUOTES_LIFETIME_MS,
  });
}
