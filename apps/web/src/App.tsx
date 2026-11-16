import { createBrowserRouter, RouterProvider } from 'react-router';
import { CatalogScreen } from '@/screens/CatalogScreen';
import { CheckoutScreen } from '@/screens/CheckoutScreen';
import { ConfiguratorScreen } from '@/screens/ConfiguratorScreen';
import { HomeScreen } from '@/screens/HomeScreen';
import { NotFoundScreen } from '@/screens/NotFoundScreen';
import { OrderScreen } from '@/screens/OrderScreen';
import { ProductScreen } from '@/screens/ProductScreen';
import { APP_ROUTES } from '@/shared/constants';
import { AppLayout } from '@/shared/ui';

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: APP_ROUTES.home.path, element: <HomeScreen /> },
      { path: APP_ROUTES.catalog.path, element: <CatalogScreen /> },
      { path: APP_ROUTES.product.path, element: <ProductScreen /> },
      { path: APP_ROUTES.configurator.path, element: <ConfiguratorScreen /> },
      { path: APP_ROUTES.checkout.path, element: <CheckoutScreen /> },
      { path: APP_ROUTES.order.path, element: <OrderScreen /> },
      { path: '*', element: <NotFoundScreen /> },
    ],
  },
]);

export function App() {
  return <RouterProvider router={router} />;
}
