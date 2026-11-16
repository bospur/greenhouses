import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { useDeliveryQuotesQuery, type CityDTO, type DeliveryQuoteDTO } from '@/data/repositories/delivery';
import { useCreateOrderMutation, useCreatePaymentMutation } from '@/data/repositories/orders';
import { APP_ROUTES } from '@/shared/constants';
import { getApiErrorMessage } from '@/shared/utils';
import {
  CHECKOUT_DEFAULTS,
  checkoutSchema,
  getCheckoutProgress,
  toE164Phone,
  useOrderDraftStore,
  type CheckoutFormValues,
  type OrderItem,
  type OrderItemSummary,
} from '../../domain';

export function useCheckoutFormLogic(item: OrderItem, summary: OrderItemSummary) {
  const navigate = useNavigate();
  const clearDraft = useOrderDraftStore((s) => s.clear);
  const form = useForm<CheckoutFormValues>({
    defaultValues: CHECKOUT_DEFAULTS,
    resolver: zodResolver(checkoutSchema),
    mode: 'onTouched',
  });
  const values = useWatch({ control: form.control }) as CheckoutFormValues;

  const quotesQuery = useDeliveryQuotesQuery(values.city?.id, summary.cargo);
  const quotes = quotesQuery.data ?? [];
  const selectedQuote = quotes.find((q) => q.id === values.quoteId) ?? null;

  const createOrder = useCreateOrderMutation();
  const createPayment = useCreatePaymentMutation();

  /** после первой попытки отправки ошибки обновляются сразу; до неё — по уходу с поля */
  const validateNow = () => form.formState.isSubmitted;

  const selectCity = (city: CityDTO | null) => {
    form.setValue('city', city, { shouldDirty: true, shouldValidate: validateNow() || city !== null });
    form.setValue('quoteId', '', { shouldValidate: validateNow() });
    form.setValue('deliveryService', '');
  };

  const selectQuote = (quote: DeliveryQuoteDTO) => {
    form.setValue('quoteId', quote.id, { shouldDirty: true, shouldValidate: true });
    form.setValue('deliveryService', quote.service);
    if (quote.service !== 'door') form.clearErrors('address');
  };

  const submit = form.handleSubmit(async (v) => {
    if (!v.city || !selectedQuote) {
      form.setError('quoteId', { message: 'Выберите способ доставки' });
      return;
    }
    const order = await createOrder
      .mutateAsync({
        item,
        delivery: {
          cityId: v.city.id,
          quoteId: selectedQuote.id,
          address: selectedQuote.service === 'door' ? v.address.trim() : null,
        },
        contact: { name: v.name.trim(), phone: toE164Phone(v.phone), email: v.email.trim() || null },
        comment: v.comment.trim() || null,
        paymentMethod: v.paymentMethod,
        clientPreview: { title: summary.title, goods: summary.price },
      })
      .catch(() => null);
    if (!order) return;

    // заказ создан — даже если платёж не создался, повторить оплату можно со страницы заказа
    const payment = await createPayment.mutateAsync(order.id).catch(() => null);
    navigate(payment ? APP_ROUTES.order.pay(order.id) : APP_ROUTES.order.build(order.id));
    clearDraft();
  });

  const delivery = selectedQuote?.cost ?? null;

  return {
    form,
    values,
    summary,
    progress: getCheckoutProgress(values),

    quotes,
    selectedQuote,
    isQuotesLoading: quotesQuery.isPending && quotesQuery.fetchStatus !== 'idle',
    quotesError: quotesQuery.isError ? getApiErrorMessage(quotesQuery.error, 'Не удалось рассчитать доставку') : null,
    retryQuotes: () => quotesQuery.refetch(),
    selectCity,
    selectQuote,

    totals: { goods: summary.price, delivery, total: summary.price + (delivery ?? 0) },
    isSubmitting: form.formState.isSubmitting,
    submitError: createOrder.isError ? getApiErrorMessage(createOrder.error, 'Не удалось оформить заказ') : null,
    submit,
  };
}

export type CheckoutFormLogic = ReturnType<typeof useCheckoutFormLogic>;
