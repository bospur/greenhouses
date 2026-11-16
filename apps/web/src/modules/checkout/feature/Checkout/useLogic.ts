import { useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { useProductQuery } from '@/data/repositories/catalog';
import { APP_ROUTES } from '@/shared/constants';
import { getApiErrorMessage, isNotFoundError } from '@/shared/utils';
import {
  getOrderItemKey,
  parseOrderItemSearchParams,
  summarizeConfig,
  summarizeProduct,
  useOrderDraftStore,
  type OrderItem,
  type OrderItemSummary,
} from '../../domain';

export type CheckoutView =
  | { status: 'empty' }
  | { status: 'loading' }
  | { status: 'notFound' }
  | { status: 'error'; message: string; retry: () => void }
  | { status: 'ready'; item: OrderItem; itemKey: string; summary: OrderItemSummary };

export function useCheckoutLogic(): CheckoutView {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const fromUrl = useMemo(() => parseOrderItemSearchParams(searchParams), [searchParams]);
  const storedItem = useOrderDraftStore((s) => s.item);
  const setItem = useOrderDraftStore((s) => s.setItem);

  // товар из ссылки «Заказать» / «В заказ» переносим в черновик, адрес оставляем чистым
  useEffect(() => {
    if (!fromUrl) return;
    setItem(fromUrl);
    navigate(APP_ROUTES.checkout.path, { replace: true, preventScrollReset: true });
  }, [fromUrl, setItem, navigate]);

  const item = fromUrl ?? storedItem;
  const productQuery = useProductQuery(item?.kind === 'product' ? item.slug : undefined);

  const summary = useMemo(() => {
    if (item?.kind === 'custom') return summarizeConfig(item.config);
    if (item?.kind === 'product' && productQuery.data) return summarizeProduct(productQuery.data);
    return null;
  }, [item, productQuery.data]);

  if (!item) return { status: 'empty' };
  if (summary) return { status: 'ready', item, itemKey: getOrderItemKey(item), summary };
  if (productQuery.isError) {
    return isNotFoundError(productQuery.error)
      ? { status: 'notFound' }
      : { status: 'error', message: getApiErrorMessage(productQuery.error), retry: () => productQuery.refetch() };
  }
  return { status: 'loading' };
}
