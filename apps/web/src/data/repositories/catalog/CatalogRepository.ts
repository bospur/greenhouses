import { isAxiosError } from 'axios';
import {
  fetchProduct,
  fetchProducts,
  type ProductNetworkDTO,
  type ProductsQueryParams,
} from '@/data/source/catalogSource';
import { MockNotFoundError } from '@/data/source/mock/mockRequest';
import { NotFoundError } from '@/shared/utils';
import type { ProductDTO } from './dto';

const mmToM = (mm: number) => Math.round(mm) / 1000;

function mapProductFromNetwork(row: ProductNetworkDTO): ProductDTO {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    shape: row.shape,
    tagline: row.tagline,
    description: row.description,
    dimensions: {
      widthM: mmToM(row.widthMm),
      lengthM: mmToM(row.lengthMm),
      heightM: mmToM(row.heightMm),
    },
    frameProfile: row.frameProfile,
    polycarbonateMm: row.polycarbonateMm,
    doors: row.doors,
    vents: row.vents,
    snowLoadKgM2: row.snowLoadKgM2,
    warrantyYears: row.warrantyYears,
    price: row.priceRub,
    oldPrice: row.oldPriceRub,
    inStock: row.inStock,
    isPopular: row.isPopular,
    kit: row.kit,
    photos: row.photos,
  };
}

class CatalogRepository {
  async getProducts(params: ProductsQueryParams = {}): Promise<ProductDTO[]> {
    const rows = await fetchProducts(params);
    return rows.map(mapProductFromNetwork);
  }

  async getProduct(slug: string): Promise<ProductDTO> {
    try {
      const row = await fetchProduct(slug);
      return mapProductFromNetwork(row);
    } catch (error) {
      if (error instanceof MockNotFoundError || (isAxiosError(error) && error.response?.status === 404)) {
        throw new NotFoundError('Модель не найдена');
      }
      throw error;
    }
  }
}

export const catalogRepository = new CatalogRepository();
