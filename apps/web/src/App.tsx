import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router';
import { HomeScreen } from '@/screens/HomeScreen';
import { NotFoundScreen } from '@/screens/NotFoundScreen';
import { APP_ROUTES } from '@/shared/constants';
import { AppLayout, PageLoader, RouteError } from '@/shared/ui';

/** черновик заказа валидируется zod — значок в шапке грузится отдельно, чтобы не тянуть zod в первый экран */
const OrderDraftLink = lazy(async () => ({ default: (await import('@/modules/checkout')).OrderDraftLink }));

/**
 * Главная и 404 — в основном бандле (первый экран без лишнего запроса),
 * остальные экраны грузятся отдельными чанками при переходе.
 * HydrateFallback на самих маршрутах: при первой загрузке шапка и футер видны сразу.
 */
const router = createBrowserRouter([
  {
    element: (
      <AppLayout
        headerActions={
          <Suspense fallback={null}>
            <OrderDraftLink />
          </Suspense>
        }
      />
    ),
    children: [
      {
        ErrorBoundary: RouteError,
        children: [
          { path: APP_ROUTES.home.path, Component: HomeScreen },
          {
            path: APP_ROUTES.catalog.path,
            lazy: { Component: async () => (await import('@/screens/CatalogScreen')).CatalogScreen },
            HydrateFallback: PageLoader,
          },
          {
            path: APP_ROUTES.product.path,
            lazy: { Component: async () => (await import('@/screens/ProductScreen')).ProductScreen },
            HydrateFallback: PageLoader,
          },
          {
            path: APP_ROUTES.configurator.path,
            lazy: { Component: async () => (await import('@/screens/ConfiguratorScreen')).ConfiguratorScreen },
            HydrateFallback: PageLoader,
          },
          {
            path: APP_ROUTES.checkout.path,
            lazy: { Component: async () => (await import('@/screens/CheckoutScreen')).CheckoutScreen },
            HydrateFallback: PageLoader,
          },
          {
            path: APP_ROUTES.order.path,
            lazy: { Component: async () => (await import('@/screens/OrderScreen')).OrderScreen },
            HydrateFallback: PageLoader,
          },
          { path: '*', Component: NotFoundScreen },
        ],
      },
    ],
  },
]);

export function App() {
  return <RouterProvider router={router} />;
}
