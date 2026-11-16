import { Link } from 'react-router';
import { CatalogGrid } from '@/modules/catalog';
import { APP_ROUTES } from '@/shared/constants';
import { Container, PageMeta, SectionHeading } from '@/shared/ui';
import styles from './CatalogScreen.module.css';

export function CatalogScreen() {
  return (
    <Container className={styles.page}>
      <PageMeta
        title="Каталог теплиц"
        description="Стандартные теплицы из поликарбоната: арочные, каплевидные и домиком. Размеры, цены и доставка по России."
      />
      <SectionHeading
        as="h1"
        tag="Каталог"
        title="Стандартные теплицы"
        subtitle={
          <>
            Выберите готовую модель — или соберите свою в{' '}
            <Link to={APP_ROUTES.configurator.path} className={styles.link}>
              конфигураторе
            </Link>
            .
          </>
        }
        className={styles.heading}
      />
      <CatalogGrid />
    </Container>
  );
}
