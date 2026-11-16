export const APP_ROUTES = {
  home: { path: '/' },
  catalog: { path: '/catalog' },
  product: {
    path: '/catalog/:slug',
    build: (slug: string) => `/catalog/${slug}`,
  },
  configurator: {
    path: '/configurator',
    fromProduct: (slug: string) => `/configurator?from=${slug}`,
    withConfig: (configQuery: string) => `/configurator?${configQuery}`,
  },
  checkout: {
    path: '/checkout',
    withProduct: (slug: string) => `/checkout?product=${slug}`,
    withConfig: (configQuery: string) => `/checkout?${configQuery}`,
  },
  order: {
    path: '/order/:orderId',
    build: (orderId: string) => `/order/${orderId}`,
    /** сразу открыть окно оплаты */
    pay: (orderId: string) => `/order/${orderId}?pay=1`,
  },
} as const;
