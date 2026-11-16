import type { ProductDTO } from '@/data/repositories/catalog';
import { cn } from '@/shared/utils';
import { GreenhouseIllustration } from '../GreenhouseIllustration';
import { PhotoPlaceholder } from './PhotoPlaceholder';
import type { GallerySlide } from './useLogic';
import styles from './ProductGallery.module.css';

type ProductGalleryProps = {
  product: ProductDTO;
  slides: GallerySlide[];
  active: number;
  onSelect: (index: number) => void;
  id?: string;
};

export function ProductGallery({ product, slides, active, onSelect, id }: ProductGalleryProps) {
  const current = slides[active] ?? slides[0];

  return (
    <div id={id} className={styles.gallery}>
      <div className={styles.main} aria-live="polite">
        {current?.kind === 'photo' ? (
          <PhotoPlaceholder caption={current.caption} />
        ) : (
          <div className={styles.scheme}>
            <GreenhouseIllustration shape={product.shape} dimensions={product.dimensions} title={product.name} />
          </div>
        )}
      </div>

      <div className={styles.thumbs} role="group" aria-label="Изображения модели">
        {slides.map((slide, i) => (
          <button
            key={`${slide.caption}-${i}`}
            type="button"
            className={cn(styles.thumb, i === active && styles.thumbActive)}
            aria-pressed={i === active}
            aria-label={slide.caption}
            onClick={() => onSelect(i)}
          >
            {slide.kind === 'scheme' ? (
              <span className={styles.thumbScheme}>
                <GreenhouseIllustration shape={product.shape} dimensions={product.dimensions} />
              </span>
            ) : (
              <PhotoPlaceholder caption={slide.caption} compact />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
