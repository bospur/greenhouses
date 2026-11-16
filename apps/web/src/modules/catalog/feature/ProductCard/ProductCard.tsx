import { Link } from 'react-router';
import type { ProductDTO } from '@/data/repositories/catalog';
import { APP_ROUTES } from '@/shared/constants';
import { Button } from '@/shared/ui';
import { formatPrice } from '@/shared/utils';
import { formatFootprint, getDiscountPercent, SHAPE_LABELS } from '../../domain';
import { GreenhouseIllustration } from '../GreenhouseIllustration';
import styles from './ProductCard.module.css';

type ProductCardProps = {
  product: ProductDTO;
};

export function ProductCard({ product }: ProductCardProps) {
  const productUrl = APP_ROUTES.product.build(product.slug);
  const discount = getDiscountPercent(product.price, product.oldPrice);

  return (
    <article className={styles.card}>
      <Link to={productUrl} className={styles.visual} aria-label={`Подробнее о теплице «${product.name}»`}>
        <GreenhouseIllustration shape={product.shape} dimensions={product.dimensions} title={product.name} />
        <div className={styles.badges}>
          <span className={styles.badge}>{SHAPE_LABELS[product.shape]}</span>
          {discount && <span className={styles.badgeSale}>−{discount}%</span>}
        </div>
        {!product.inStock && <span className={styles.preorder}>Под заказ</span>}
      </Link>

      <div className={styles.body}>
        <h3 className={styles.title}>
          <Link to={productUrl}>«{product.name}»</Link>
          <span className={styles.size}>{formatFootprint(product.dimensions)}</span>
        </h3>
        <p className={styles.tagline}>{product.tagline}</p>

        <ul className={styles.specs}>
          <li>Каркас {product.frameProfile.split(',')[0]}</li>
          <li>Поликарбонат {product.polycarbonateMm} мм</li>
          <li>Снег до {product.snowLoadKgM2} кг/м²</li>
        </ul>

        <div className={styles.priceRow}>
          <span className={styles.price}>{formatPrice(product.price)}</span>
          {product.oldPrice && <span className={styles.oldPrice}>{formatPrice(product.oldPrice)}</span>}
        </div>

        <div className={styles.actions}>
          <Button to={productUrl} variant="outline" size="sm">
            Подробнее
          </Button>
          <Button to={APP_ROUTES.checkout.withProduct(product.slug)} size="sm">
            Заказать
          </Button>
        </div>
      </div>
    </article>
  );
}
