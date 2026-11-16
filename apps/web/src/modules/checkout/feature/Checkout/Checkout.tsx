import { ErrorState } from '@/shared/ui';
import { CheckoutForm } from '../CheckoutForm';
import { CheckoutSkeleton } from './CheckoutSkeleton';
import { EmptyCheckout } from './EmptyCheckout';
import { useCheckoutLogic } from './useLogic';

export function Checkout() {
  const view = useCheckoutLogic();

  switch (view.status) {
    case 'empty':
      return <EmptyCheckout title="Вы ещё не выбрали теплицу" text="Возьмите готовую модель из каталога или соберите свою." />;
    case 'notFound':
      return (
        <EmptyCheckout
          title="Эта модель больше не продаётся"
          text="Выберите другую теплицу в каталоге или соберите похожую в конфигураторе."
        />
      );
    case 'loading':
      return <CheckoutSkeleton />;
    case 'error':
      return <ErrorState message={view.message} onRetry={view.retry} />;
    case 'ready':
      return <CheckoutForm key={view.itemKey} item={view.item} summary={view.summary} />;
  }
}
