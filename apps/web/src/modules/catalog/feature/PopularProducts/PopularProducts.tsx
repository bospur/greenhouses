import { APP_ROUTES } from '@/shared/constants';
import { Button, Container, ErrorState, Icon, Reveal, SectionHeading } from '@/shared/ui';
import { ProductCard, ProductCardSkeleton } from '../ProductCard';
import { usePopularProductsLogic } from './useLogic';
import styles from './PopularProducts.module.css';

export function PopularProducts() {
  const logic = usePopularProductsLogic();

  return (
    <section className={styles.section} id="popular">
      <Container>
        <div className={styles.head}>
          <Reveal>
            <SectionHeading
              tag="Каталог"
              title="Популярные модели"
              subtitle="Готовы к отправке со склада. Любую модель можно изменить под свой участок в конфигураторе."
            />
          </Reveal>
          <Button to={APP_ROUTES.catalog.path} variant="outline" className={styles.allLink}>
            Весь каталог <Icon name="arrowRight" size={18} />
          </Button>
        </div>

        {logic.isError ? (
          <ErrorState message={logic.errorMessage} onRetry={logic.retry} />
        ) : (
          <div className={styles.grid}>
            {logic.isLoading
              ? Array.from({ length: logic.skeletonCount }, (_, i) => <ProductCardSkeleton key={i} />)
              : logic.products.map((product, i) => (
                  <Reveal key={product.id} delay={i * 80}>
                    <ProductCard product={product} />
                  </Reveal>
                ))}
          </div>
        )}
      </Container>
    </section>
  );
}
