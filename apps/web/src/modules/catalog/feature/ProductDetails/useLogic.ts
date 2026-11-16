import { useMemo, useState } from 'react';
import { useProductQuery } from '@/data/repositories/catalog';
import type { TabItem } from '@/shared/ui';
import { getApiErrorMessage, isNotFoundError } from '@/shared/utils';
import { buildSpecRows, formatFootprint, getDiscountPercent } from '../../domain';

export type ProductTab = 'specs' | 'drawing' | 'kit' | 'photos';

const GALLERY_ID = 'product-gallery';

export const PRODUCT_TABS: readonly TabItem<ProductTab>[] = [
  { id: 'specs', label: 'Характеристики' },
  { id: 'drawing', label: 'Чертёж' },
  { id: 'kit', label: 'Комплектация' },
  { id: 'photos', label: 'Фото' },
];

/** Слайд 0 — схема по размерам, далее — фото (пока плейсхолдеры с подписями) */
export type GallerySlide = { kind: 'scheme'; caption: string } | { kind: 'photo'; caption: string };

export function useProductDetailsLogic(slug: string | undefined) {
  const { data: product, isPending, isError, error, refetch } = useProductQuery(slug);
  const [activeTab, setActiveTab] = useState<ProductTab>('specs');
  const [activeSlide, setActiveSlide] = useState(0);

  const view = useMemo(() => {
    if (!product) return null;
    const slides: GallerySlide[] = [
      { kind: 'scheme', caption: 'Схема по размерам' },
      ...product.photos.map((caption) => ({ kind: 'photo' as const, caption })),
    ];
    return {
      product,
      fullName: `Теплица «${product.name}» ${formatFootprint(product.dimensions)}`,
      discount: getDiscountPercent(product.price, product.oldPrice),
      specRows: buildSpecRows(product),
      slides,
    };
  }, [product]);

  const notFound = isError && isNotFoundError(error);

  return {
    isLoading: isPending,
    isNotFound: notFound,
    isError: isError && !notFound,
    errorMessage: getApiErrorMessage(error),
    retry: () => void refetch(),

    view,

    activeTab,
    setActiveTab,

    galleryId: GALLERY_ID,
    activeSlide,
    setActiveSlide,
    /** открыть фото из вкладки «Фото» в большой галерее */
    showPhoto: (photoIndex: number) => {
      setActiveSlide(photoIndex + 1);
      document.getElementById(GALLERY_ID)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    },
  };
}
