import type { ProductDTO } from '@/data/repositories/catalog';
import { APP_ROUTES } from '@/shared/constants';
import { Button, Icon } from '@/shared/ui';
import { cn, formatPrice } from '@/shared/utils';
import { SHAPE_LABELS } from '../../domain';
import styles from './ProductSummary.module.css';

type ProductSummaryProps = {
  product: ProductDTO;
  fullName: string;
  discount: number | null;
};

export function ProductSummary({ product, fullName, discount }: ProductSummaryProps) {
  const highlights = [
    `Каркас ${product.frameProfile}`,
    `Поликарбонат ${product.polycarbonateMm} мм`,
    `Снеговая нагрузка до ${product.snowLoadKgM2} кг/м²`,
    `Двери: ${product.doors}, форточки: ${product.vents}`,
  ];

  return (
    <div className={styles.summary}>
      <div className={styles.badges}>
        <span className={styles.shape}>{SHAPE_LABELS[product.shape]}</span>
        <span className={cn(styles.stock, !product.inStock && styles.preorder)}>
          {product.inStock ? (
            <>
              <Icon name="check" size={14} strokeWidth={2.4} /> В наличии
            </>
          ) : (
            'Под заказ'
          )}
        </span>
      </div>

      <h1 className={styles.title}>{fullName}</h1>
      <p className={styles.tagline}>{product.tagline}</p>

      <div className={styles.priceRow}>
        <span className={styles.price}>{formatPrice(product.price)}</span>
        {product.oldPrice && <span className={styles.oldPrice}>{formatPrice(product.oldPrice)}</span>}
        {discount && <span className={styles.sale}>−{discount}%</span>}
      </div>

      <p className={styles.description}>{product.description}</p>

      <ul className={styles.highlights}>
        {highlights.map((text) => (
          <li key={text}>
            <Icon name="check" size={16} strokeWidth={2.2} className={styles.checkIcon} />
            {text}
          </li>
        ))}
      </ul>

      <div className={styles.actions}>
        <Button to={APP_ROUTES.checkout.withProduct(product.slug)} size="lg">
          Заказать
        </Button>
        <Button to={APP_ROUTES.configurator.fromProduct(product.slug)} variant="outline" size="lg">
          <Icon name="ruler" size={18} /> Изменить размеры
        </Button>
      </div>

      <p className={styles.delivery}>
        <Icon name="truck" size={18} />
        Доставка транспортной компанией по всей России — стоимость рассчитаем при оформлении заказа.
      </p>
    </div>
  );
}
