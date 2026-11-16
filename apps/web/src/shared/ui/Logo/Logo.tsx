import { Link } from 'react-router';
import { APP_ROUTES } from '@/shared/constants';
import { cn } from '@/shared/utils';
import styles from './Logo.module.css';

type LogoProps = {
  inverted?: boolean;
  onClick?: () => void;
};

export function Logo({ inverted = false, onClick }: LogoProps) {
  return (
    <Link to={APP_ROUTES.home.path} className={cn(styles.logo, inverted && styles.inverted)} onClick={onClick}>
      <svg className={styles.mark} viewBox="0 0 32 32" aria-hidden="true">
        <rect width="32" height="32" rx="8" />
        <path d="M6 24V15a10 9 0 0 1 20 0v9z" />
      </svg>
      <span className={styles.text}>
        Теплица<span>Про</span>
      </span>
    </Link>
  );
}
