import { useQuery } from '@tanstack/react-query';
import type { ProductsQueryParams } from '@/data/source/catalogSource';
import { CATALOG_CACHE_LIFETIME_MS } from '@/shared/constants';
import { catalogRepository } from '../CatalogRepository';
import { catalogKeys } from '../queryKeys';

export function useProductsQuery(params: ProductsQueryParams = {}) {
  return useQuery({
    queryKey: catalogKeys.products(params),
    queryFn: () => catalogRepository.getProducts(params),
    staleTime: CATALOG_CACHE_LIFETIME_MS,
  });
}
