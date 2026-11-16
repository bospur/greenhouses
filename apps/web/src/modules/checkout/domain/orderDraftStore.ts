import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { parseStoredOrderItem, type OrderItem } from './orderItem';

type OrderDraftState = {
  item: OrderItem | null;
  setItem: (item: OrderItem) => void;
  clear: () => void;
};

/** Черновик заказа (ADR-002): только выбранный товар, без цен и котировок — они в React Query */
export const useOrderDraftStore = create<OrderDraftState>()(
  persist(
    (set) => ({
      item: null,
      setItem: (item) => set({ item }),
      clear: () => set({ item: null }),
    }),
    {
      name: 'greenhouses-order-draft',
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ item: state.item }),
      migrate: () => ({ item: null }),
      merge: (persisted, current) => ({
        ...current,
        item: parseStoredOrderItem((persisted as { item?: unknown } | undefined)?.item),
      }),
    },
  ),
);
