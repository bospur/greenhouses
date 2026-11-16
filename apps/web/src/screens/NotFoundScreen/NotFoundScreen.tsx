import { APP_ROUTES } from '@/shared/constants';
import { Button, Container, PageMeta, SectionHeading } from '@/shared/ui';
import styles from './NotFoundScreen.module.css';

export function NotFoundScreen() {
  return (
    <Container className={styles.page}>
      <PageMeta title="Страница не найдена" noIndex />
      <SectionHeading
        as="h1"
        align="center"
        tag="Ошибка 404"
        title="Страница не найдена"
        subtitle="Возможно, ссылка устарела. Загляните в каталог или соберите теплицу по своим размерам."
      />
      <div className={styles.actions}>
        <Button to={APP_ROUTES.catalog.path}>Каталог теплиц</Button>
        <Button to={APP_ROUTES.home.path} variant="outline">
          На главную
        </Button>
      </div>
    </Container>
  );
}
