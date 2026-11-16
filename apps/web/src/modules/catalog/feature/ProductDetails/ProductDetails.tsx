import { APP_ROUTES, COMPANY } from '@/shared/constants';
import { Breadcrumbs, ErrorState } from '@/shared/ui';
import { ProductDetailsSkeleton } from './ProductDetailsSkeleton';
import { ProductGallery } from './ProductGallery';
import { ProductNotFound } from './ProductNotFound';
import { ProductSummary } from './ProductSummary';
import { ProductTabs } from './ProductTabs';
import { useProductDetailsLogic } from './useLogic';
import styles from './ProductDetails.module.css';

type ProductDetailsProps = {
  slug: string | undefined;
};

export function ProductDetails({ slug }: ProductDetailsProps) {
  const logic = useProductDetailsLogic(slug);

  if (logic.isNotFound) return <ProductNotFound />;
  if (logic.isError) {
    return (
      <div className={styles.state}>
        <ErrorState message={logic.errorMessage} onRetry={logic.retry} />
      </div>
    );
  }
  if (logic.isLoading || !logic.view) return <ProductDetailsSkeleton />;

  const { product, fullName, discount, specRows, slides } = logic.view;

  return (
    <>
      <title>{`${fullName} — ${COMPANY.name}`}</title>
      <Breadcrumbs
        items={[
          { label: 'Главная', to: APP_ROUTES.home.path },
          { label: 'Теплицы', to: APP_ROUTES.catalog.path },
          { label: fullName },
        ]}
      />

      <div className={styles.top}>
        <ProductGallery
          id={logic.galleryId}
          product={product}
          slides={slides}
          active={logic.activeSlide}
          onSelect={logic.setActiveSlide}
        />
        <ProductSummary product={product} fullName={fullName} discount={discount} />
      </div>

      <ProductTabs
        product={product}
        specRows={specRows}
        activeTab={logic.activeTab}
        onTabChange={logic.setActiveTab}
        onPhotoClick={logic.showPhoto}
      />
    </>
  );
}
