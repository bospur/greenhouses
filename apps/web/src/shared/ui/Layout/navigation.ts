import { APP_ROUTES } from '@/shared/constants';

export type NavItem = {
  label: string;
  to: string;
  end?: boolean;
};

export const NAV_ITEMS: NavItem[] = [
  { label: 'Главная', to: APP_ROUTES.home.path, end: true },
  { label: 'Каталог теплиц', to: APP_ROUTES.catalog.path },
  { label: 'Свои размеры', to: APP_ROUTES.configurator.path },
];
