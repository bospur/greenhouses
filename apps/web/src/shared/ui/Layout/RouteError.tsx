import { useEffect, useState } from 'react';
import { useRouteError } from 'react-router';
import { APP_ROUTES, COMPANY } from '@/shared/constants';
import { isChunkLoadError } from '@/shared/utils';
import { Button } from '../Button';
import { Container } from '../Container';
import { PageLoader } from '../PageLoader';
import { PageMeta } from '../PageMeta';
import { SectionHeading } from '../SectionHeading';
import styles from './RouteError.module.css';

const RELOAD_MARK_KEY = 'greenhouses-chunk-reload';
/** повторная ошибка вскоре после перезагрузки — не перезагружаем по кругу, показываем экран */
const RELOAD_COOLDOWN_MS = 30_000;

function canAutoReload() {
  try {
    const last = Number(sessionStorage.getItem(RELOAD_MARK_KEY));
    return !last || Date.now() - last > RELOAD_COOLDOWN_MS;
  } catch {
    return false;
  }
}

/** ErrorBoundary маршрутов: падение экрана или чанк, которого больше нет на сервере после деплоя */
export function RouteError() {
  const error = useRouteError();
  const isOutdated = isChunkLoadError(error);
  const [reloading] = useState(() => isOutdated && canAutoReload());

  useEffect(() => {
    if (!reloading) {
      console.error(error);
      return;
    }
    try {
      sessionStorage.setItem(RELOAD_MARK_KEY, String(Date.now()));
    } catch {
      // приватный режим — перезагрузимся один раз и без отметки
    }
    window.location.reload();
  }, [reloading, error]);

  if (reloading) return <PageLoader />;

  return (
    <Container className={styles.page}>
      <PageMeta title={isOutdated ? 'Сайт обновился' : 'Ошибка'} noIndex />
      <SectionHeading
        as="h1"
        align="center"
        tag={isOutdated ? 'Обновление' : 'Ошибка'}
        title={isOutdated ? 'Сайт обновился' : 'Что-то пошло не так'}
        subtitle={
          isOutdated
            ? 'Пока страница была открыта, мы выпустили новую версию — обновите страницу, чтобы продолжить.'
            : `Попробуйте обновить страницу. Если ошибка повторится — позвоните нам: ${COMPANY.phone}`
        }
      />
      <div className={styles.actions}>
        <Button onClick={() => window.location.reload()}>Обновить страницу</Button>
        <Button to={APP_ROUTES.home.path} variant="outline">
          На главную
        </Button>
      </div>
    </Container>
  );
}
