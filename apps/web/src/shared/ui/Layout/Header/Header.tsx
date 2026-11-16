import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router';
import { APP_ROUTES, COMPANY } from '@/shared/constants';
import { cn } from '@/shared/utils';
import { Button } from '../../Button';
import { Container } from '../../Container';
import { Logo } from '../../Logo';
import { NAV_ITEMS } from '../navigation';
import styles from './Header.module.css';

export function Header() {
  const { pathname } = useLocation();
  // меню закрывается само при смене маршрута
  const [menuOpenAt, setMenuOpenAt] = useState<string | null>(null);
  const menuOpen = menuOpenAt === pathname;
  const toggleMenu = () => setMenuOpenAt(menuOpen ? null : pathname);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  return (
    <header className={styles.header}>
      <Container className={styles.inner}>
        <Logo />

        <nav className={cn(styles.nav, menuOpen && styles.navOpen)} aria-label="Основная навигация">
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
          <Button to={APP_ROUTES.configurator.path} size="sm" className={styles.cta}>
            Рассчитать
          </Button>
          <button
            type="button"
            className={cn(styles.burger, menuOpen && styles.burgerOpen)}
            aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'}
            aria-expanded={menuOpen}
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
