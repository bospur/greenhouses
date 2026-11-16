import { useQuery, useQueryClient } from '@tanstack/react-query';
import { CATALOG_CACHE_LIFETIME_MS } from '@/shared/constants';
import { isNotFoundError } from '@/shared/utils';
import { catalogRepository } from '../CatalogRepository';
import type { ProductDTO } from '../dto';
import { catalogKeys } from '../queryKeys';

export function useProductQuery(slug: string | undefined) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: catalogKeys.product(slug ?? ''),
    queryFn: () => catalogRepository.getProduct(slug!),
    enabled: Boolean(slug),
    staleTime: CATALOG_CACHE_LIFETIME_MS,
    retry: (failureCount, error) => !isNotFoundError(error) && failureCount < 1,
    placeholderData: () =>
      queryClient
        .getQueriesData<ProductDTO[]>({ queryKey: [...catalogKeys.all, 'products'] })
        .flatMap(([, list]) => list ?? [])
        .find((p) => p.slug === slug),
  });
}
