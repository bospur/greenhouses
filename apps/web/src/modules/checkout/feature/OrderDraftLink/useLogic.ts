import { useOrderDraftStore } from '../../domain';

export function useOrderDraftLinkLogic() {
  const hasItem = useOrderDraftStore((s) => s.item !== null);

  return {
    hasItem,
    label: hasItem ? 'Оформление заказа: выбрана 1 теплица' : 'Оформление заказа: теплица не выбрана',
  };
}
