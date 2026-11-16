import type { ProductsQueryParams } from '@/data/source/catalogSource';

export const catalogKeys = {
  all: ['catalog'] as const,
  products: (params: ProductsQueryParams = {}) => [...catalogKeys.all, 'products', params] as const,
  product: (slug: string) => [...catalogKeys.all, 'product', slug] as const,
};
