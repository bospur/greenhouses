import { Link } from 'react-router';
import type { ProductDTO } from '@/data/repositories/catalog';
import { APP_ROUTES } from '@/shared/constants';
import { getTabIds, Tabs } from '@/shared/ui';
import type { SpecRow } from '../../domain';
import { ProductDrawing } from '../ProductDrawing';
import { PhotoPlaceholder } from './PhotoPlaceholder';
import { PRODUCT_TABS, type ProductTab } from './useLogic';
import styles from './ProductTabs.module.css';

const ID_PREFIX = 'product';

type ProductTabsProps = {
  product: ProductDTO;
  specRows: SpecRow[];
  activeTab: ProductTab;
  onTabChange: (tab: ProductTab) => void;
  onPhotoClick: (photoIndex: number) => void;
};

export function ProductTabs({ product, specRows, activeTab, onTabChange, onPhotoClick }: ProductTabsProps) {
  const { tabId, panelId } = getTabIds(ID_PREFIX, activeTab);

  return (
    <section className={styles.section}>
      <Tabs items={PRODUCT_TABS} value={activeTab} onChange={onTabChange} idPrefix={ID_PREFIX} label="Информация о модели" />

      <div id={panelId} role="tabpanel" aria-labelledby={tabId} tabIndex={0} className={styles.panel}>
        {activeTab === 'specs' && (
          <dl className={styles.specs}>
            {specRows.map((row) => (
              <div key={row.label} className={styles.specRow}>
                <dt>{row.label}</dt>
                <dd>{row.value}</dd>
              </div>
            ))}
          </dl>
        )}

        {activeTab === 'drawing' && (
          <>
            <p className={styles.lead}>
              Схематичный вид спереди и сверху в масштабе. Пунктир — дуги каркаса с шагом около 1&nbsp;м, закрашены
              форточки. Нужны другие размеры —{' '}
              <Link to={APP_ROUTES.configurator.fromProduct(product.slug)} className={styles.link}>
                измените их в конфигураторе
              </Link>
              .
            </p>
            <ProductDrawing
              shape={product.shape}
              dimensions={product.dimensions}
              doors={product.doors}
              vents={product.vents}
            />
          </>
        )}

        {activeTab === 'kit' && (
          <ul className={styles.kit}>
            {product.kit.map((item) => (
              <li key={item.name}>
                <span>{item.name}</span>
                <span className={styles.qty}>{item.qty}</span>
              </li>
            ))}
          </ul>
        )}

        {activeTab === 'photos' && (
          <div className={styles.photos}>
            {product.photos.map((caption, i) => (
              <button key={`${caption}-${i}`} type="button" className={styles.photo} onClick={() => onPhotoClick(i)}>
                <PhotoPlaceholder caption={caption} />
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
