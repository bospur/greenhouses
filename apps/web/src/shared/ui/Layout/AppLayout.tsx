import { useEffect, useRef, type MouseEvent, type ReactNode } from 'react';
import { Outlet, ScrollRestoration, useLocation, useNavigation } from 'react-router';
import { cn } from '@/shared/utils';
import { Footer } from './Footer';
import { Header } from './Header';
import styles from './AppLayout.module.css';

type AppLayoutProps = {
  /** кнопки справа в шапке из модулей (ссылка на черновик заказа) — shared не знает о модулях */
  headerActions?: ReactNode;
};

export function AppLayout({ headerActions }: AppLayoutProps) {
  const { pathname } = useLocation();
  const navigation = useNavigation();
  const mainRef = useRef<HTMLElement>(null);
  const prevPathnameRef = useRef(pathname);

  // при переходе на другую страницу фокус — в начало контента, как после загрузки документа
  useEffect(() => {
    if (prevPathnameRef.current === pathname) return;
    prevPathnameRef.current = pathname;
    mainRef.current?.focus({ preventScroll: true });
  }, [pathname]);

  const skipToContent = (e: MouseEvent) => {
    e.preventDefault();
    mainRef.current?.focus();
  };

  return (
    <>
      <a href="#main" className={styles.skipLink} onClick={skipToContent}>
        Перейти к содержимому
      </a>
      <div className={cn(styles.progress, navigation.state !== 'idle' && styles.progressActive)} aria-hidden="true" />
      <Header actions={headerActions} />
      <main id="main" ref={mainRef} tabIndex={-1} className={styles.main}>
        <Outlet />
      </main>
      <Footer />
      <ScrollRestoration />
    </>
  );
}
