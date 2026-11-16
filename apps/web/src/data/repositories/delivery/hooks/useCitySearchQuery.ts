import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { CATALOG_CACHE_LIFETIME_MS } from '@/shared/constants';
import { deliveryRepository } from '../DeliveryRepository';
import { deliveryKeys } from '../queryKeys';

export const CITY_QUERY_MIN_LENGTH = 2;

export function useCitySearchQuery(query: string, { enabled = true }: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: deliveryKeys.cities(query),
    queryFn: () => deliveryRepository.searchCities(query),
    enabled: enabled && query.trim().length >= CITY_QUERY_MIN_LENGTH,
    staleTime: CATALOG_CACHE_LIFETIME_MS,
    placeholderData: keepPreviousData,
  });
}
