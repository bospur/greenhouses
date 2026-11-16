import { APP_ROUTES } from '@/shared/constants';
import { Button, ErrorState, Icon } from '@/shared/ui';
import { ProductCard, ProductCardSkeleton } from '../ProductCard';
import { CatalogFiltersPanel } from './CatalogFiltersPanel';
import { useCatalogGridLogic } from './useLogic';
import styles from './CatalogGrid.module.css';

export function CatalogGrid() {
  const logic = useCatalogGridLogic();

  return (
    <div className={styles.wrap}>
      <CatalogFiltersPanel logic={logic} />

      <div className={styles.summary} aria-live="polite">
        {!logic.isLoading && !logic.isError && (
          <>
            <span>
              Найдено: <strong>{logic.resultLabel}</strong>
            </span>
            {logic.hasActiveFilters && (
              <button type="button" className={styles.reset} onClick={logic.resetFilters}>
                <Icon name="close" size={14} /> Сбросить фильтры
              </button>
            )}
          </>
        )}
      </div>

      {logic.isError ? (
        <ErrorState message={logic.errorMessage} onRetry={logic.retry} />
      ) : logic.isEmpty ? (
        <div className={styles.empty}>
          <Icon name="ruler" size={36} className={styles.emptyIcon} />
          <h2>Под эти условия готовых моделей нет</h2>
          <p>Ослабьте фильтры или соберите теплицу нужного размера в конфигураторе — цена посчитается сразу.</p>
          <div className={styles.emptyActions}>
            <Button variant="outline" onClick={logic.resetFilters}>
              Сбросить фильтры
            </Button>
            <Button to={APP_ROUTES.configurator.path}>Открыть конфигуратор</Button>
          </div>
        </div>
      ) : (
        <div className={styles.grid}>
          {logic.isLoading
            ? Array.from({ length: logic.skeletonCount }, (_, i) => <ProductCardSkeleton key={i} />)
            : logic.products.map((product) => (
                <div key={product.id} className={styles.item}>
                  <ProductCard product={product} />
                </div>
              ))}
        </div>
      )}
    </div>
  );
}
