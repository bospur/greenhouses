import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router';
import { useCreatePaymentMutation, useOrderQuery } from '@/data/repositories/orders';
import { APP_ROUTES } from '@/shared/constants';
import { getApiErrorMessage, isNotFoundError } from '@/shared/utils';
import { buildOrderTimeline, parseStoredOrderItem, summarizeConfig } from '../../domain';

const PAY_PARAM = 'pay';

export function useOrderStatusLogic(orderId: string | undefined) {
  const [searchParams, setSearchParams] = useSearchParams();
  const orderQuery = useOrderQuery(orderId);
  const createPayment = useCreatePaymentMutation();
  const [isPaymentOpen, setPaymentOpen] = useState(() => searchParams.get(PAY_PARAM) === '1');

  const order = orderQuery.data;

  const itemLink = useMemo(() => {
    const item = order ? parseStoredOrderItem(order.item) : null;
    if (!item) return null;
    return item.kind === 'product'
      ? { href: APP_ROUTES.product.build(item.slug), label: 'Страница модели' }
      : { href: summarizeConfig(item.config).edit.href, label: 'Открыть в конфигураторе' };
  }, [order]);

  const openPayment = () => {
    if (!order) return;
    setPaymentOpen(true);
    if (order.payment?.status !== 'pending') createPayment.mutate(order.id);
  };

  const closePayment = () => {
    setPaymentOpen(false);
    if (searchParams.has(PAY_PARAM)) setSearchParams({}, { replace: true, preventScrollReset: true });
  };

  return {
    isLoading: orderQuery.isPending,
    isNotFound: orderQuery.isError && isNotFoundError(orderQuery.error),
    errorMessage: orderQuery.isError ? getApiErrorMessage(orderQuery.error, 'Не удалось загрузить заказ') : null,
    retry: () => orderQuery.refetch(),
    order,
    timeline: order ? buildOrderTimeline(order.status) : [],
    itemLink,
    canPay: order?.status === 'awaiting_payment',

    payment: {
      open: isPaymentOpen && Boolean(order),
      isCreating: createPayment.isPending,
      error: createPayment.isError ? getApiErrorMessage(createPayment.error, 'Не удалось создать платёж') : null,
      retry: openPayment,
      onClose: closePayment,
    },
    openPayment,
  };
}

export type OrderStatusLogic = ReturnType<typeof useOrderStatusLogic>;
