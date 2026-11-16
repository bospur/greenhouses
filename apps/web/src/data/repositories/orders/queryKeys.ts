export const orderKeys = {
  all: ['orders'] as const,
  order: (orderId: string) => [...orderKeys.all, orderId] as const,
};
