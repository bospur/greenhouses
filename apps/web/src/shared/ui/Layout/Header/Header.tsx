import { useEffect, useState, type ReactNode } from 'react';
import { NavLink, useLocation } from 'react-router';
import { APP_ROUTES, COMPANY } from '@/shared/constants';
import { cn } from '@/shared/utils';
import { Button } from '../../Button';
import { Container } from '../../Container';
import { Logo } from '../../Logo';
import { NAV_ITEMS } from '../navigation';
import styles from './Header.module.css';

const NAV_ID = 'main-nav';

type HeaderProps = {
  /** слот под иконки-кнопки 40×40; место резервируется сразу, даже если содержимое грузится лениво */
  actions?: ReactNode;
};

export function Header({ actions }: HeaderProps) {
  const { pathname } = useLocation();
  // меню закрывается само при смене маршрута
  const [menuOpenAt, setMenuOpenAt] = useState<string | null>(null);
  const menuOpen = menuOpenAt === pathname;
  const toggleMenu = () => setMenuOpenAt(menuOpen ? null : pathname);

  useEffect(() => {
    if (!menuOpen) return;
    document.body.style.overflow = 'hidden';
    const closeOnEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpenAt(null);
    };
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [menuOpen]);

  return (
    <header className={styles.header}>
      <Container className={styles.inner}>
        <Logo />

        <nav id={NAV_ID} className={cn(styles.nav, menuOpen && styles.navOpen)} aria-label="Основная навигация">
          <ul>
            {NAV_ITEMS.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) => cn(styles.link, isActive && styles.linkActive)}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
          <a href={COMPANY.phoneHref} className={styles.mobilePhone}>
            {COMPANY.phone}
          </a>
        </nav>

        <div className={styles.actions}>
          <a href={COMPANY.phoneHref} className={styles.phone}>
            {COMPANY.phone}
          </a>
          {actions != null && <span className={styles.extra}>{actions}</span>}
          <Button to={APP_ROUTES.configurator.path} size="sm" className={styles.cta}>
            Рассчитать
          </Button>
          <button
            type="button"
            className={cn(styles.burger, menuOpen && styles.burgerOpen)}
            aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'}
            aria-expanded={menuOpen}
            aria-controls={NAV_ID}
            onClick={toggleMenu}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </Container>
    </header>
  );
}
