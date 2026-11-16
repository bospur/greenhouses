import { APP_ROUTES } from '@/shared/constants';
import { Button, PageMeta, SectionHeading } from '@/shared/ui';
import { GreenhouseIllustration } from '../GreenhouseIllustration';
import styles from './ProductDetails.module.css';

const PLACEHOLDER_DIMENSIONS = { widthM: 3, lengthM: 4, heightM: 2.1 };

export function ProductNotFound() {
  return (
    <div className={styles.notFound}>
      <PageMeta title="Модель не найдена" noIndex />
      <div className={styles.notFoundArt} aria-hidden="true">
        <GreenhouseIllustration shape="arch" dimensions={PLACEHOLDER_DIMENSIONS} />
      </div>
      <SectionHeading
        as="h1"
        align="center"
        tag="Ошибка 404"
        title="Такой модели нет в каталоге"
        subtitle="Возможно, её сняли с производства или ссылка устарела. Посмотрите другие теплицы или соберите свою по нужным размерам."
      />
      <div className={styles.notFoundActions}>
        <Button to={APP_ROUTES.catalog.path}>Перейти в каталог</Button>
        <Button to={APP_ROUTES.configurator.path} variant="outline">
          Собрать свою
        </Button>
      </div>
    </div>
  );
}
