import { Link } from 'react-router';
import { CatalogGrid } from '@/modules/catalog';
import { APP_ROUTES, COMPANY } from '@/shared/constants';
import { Container, SectionHeading } from '@/shared/ui';
import styles from './CatalogScreen.module.css';

export function CatalogScreen() {
  return (
    <Container className={styles.page}>
      <title>{`Каталог теплиц — ${COMPANY.name}`}</title>
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
