import { z } from 'zod';
import {
  configShapeSchema,
  normalizeConfig,
  parseConfigSearchParams,
  toConfigSearchParams,
  type GreenhouseConfig,
} from '@/modules/configurator/domain';

/** Что покупают: модель каталога или своя конфигурация. Цены здесь нет — её даёт каталог или расчёт */
export type OrderItem = { kind: 'product'; slug: string } | { kind: 'custom'; config: GreenhouseConfig };

const PRODUCT_PARAM = 'product';

/** `/checkout?product=slug` или `/checkout?shape=…&w=…` → товар; null — в адресе товара нет */
export function parseOrderItemSearchParams(params: URLSearchParams): OrderItem | null {
  const slug = params.get(PRODUCT_PARAM)?.trim();
  if (slug) return { kind: 'product', slug };
  const config = parseConfigSearchParams(params);
  return config ? { kind: 'custom', config } : null;
}

/** Ключ товара — форма оформления пересоздаётся при смене товара */
export function getOrderItemKey(item: OrderItem): string {
  return item.kind === 'product' ? `product:${item.slug}` : `custom:${toConfigSearchParams(item.config).toString()}`;
}

const storedItemSchema = z.discriminatedUnion('kind', [
  z.object({ kind: z.literal('product'), slug: z.string().min(1) }),
  z.object({ kind: z.literal('custom'), config: configShapeSchema }),
]);

/** Черновик из localStorage мог устареть — невалидный отбрасываем, конфигурацию приводим к допустимой */
export function parseStoredOrderItem(value: unknown): OrderItem | null {
  const parsed = storedItemSchema.safeParse(value);
  if (!parsed.success) return null;
  const item = parsed.data;
  return item.kind === 'custom' ? { kind: 'custom', config: normalizeConfig(item.config).config } : item;
}
