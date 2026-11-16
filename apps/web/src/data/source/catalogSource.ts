import { ENV } from '@/shared/config/env';
import { axiosInstance } from './axiosInstance';
import { CATALOG_MOCK } from './mock/catalogMock';
import { MockNotFoundError, mockRequest } from './mock/mockRequest';

export type GreenhouseShapeNetwork = 'arch' | 'drop' | 'gable';

export type ProductNetworkDTO = {
  id: string;
  slug: string;
  name: string;
  shape: GreenhouseShapeNetwork;
  tagline: string;
  description: string;
  widthMm: number;
  lengthMm: number;
  heightMm: number;
  frameProfile: string;
  polycarbonateMm: number;
  doors: number;
  vents: number;
  snowLoadKgM2: number;
  warrantyYears: number;
  priceRub: number;
  oldPriceRub: number | null;
  inStock: boolean;
  isPopular: boolean;
  kit: Array<{ name: string; qty: string }>;
  photos: string[];
};

export type ProductsQueryParams = {
  popular?: boolean;
};

export async function fetchProducts(params: ProductsQueryParams = {}): Promise<ProductNetworkDTO[]> {
  if (ENV.useMocks) {
    return mockRequest(() => CATALOG_MOCK.filter((p) => (params.popular ? p.isPopular : true)));
  }
  const { data } = await axiosInstance.get<ProductNetworkDTO[]>('/api/v1/products', { params });
  return data;
}

export async function fetchProduct(slug: string): Promise<ProductNetworkDTO> {
  if (ENV.useMocks) {
    return mockRequest(() => {
      const product = CATALOG_MOCK.find((p) => p.slug === slug);
      if (!product) throw new MockNotFoundError('Модель не найдена');
      return product;
    });
  }
  const { data } = await axiosInstance.get<ProductNetworkDTO>(`/api/v1/products/${encodeURIComponent(slug)}`);
  return data;
}
