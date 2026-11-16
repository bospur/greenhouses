import { APP_ROUTES } from '@/shared/constants';
import { Button, Container, SectionHeading } from '@/shared/ui';

export function NotFoundScreen() {
  return (
    <Container>
      <div style={{ padding: '96px 0', textAlign: 'center' }}>
        <SectionHeading
          as="h1"
          align="center"
          tag="Ошибка 404"
          title="Страница не найдена"
          subtitle="Возможно, ссылка устарела. Загляните в каталог или соберите теплицу по своим размерам."
        />
        <Button to={APP_ROUTES.home.path}>На главную</Button>
      </div>
    </Container>
  );
}
