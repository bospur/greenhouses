import { useMemo } from 'react';
import { useSearchParams } from 'react-router';
import { useProductQuery } from '@/data/repositories/catalog';
import { formatFootprint } from '@/modules/catalog/domain';
import { isNotFoundError } from '@/shared/utils';
import { DEFAULT_CONFIG, configFromProduct, parseConfigSearchParams, toConfigSearchParams } from '../../domain';

export function useConfiguratorLogic() {
  const [searchParams] = useSearchParams();
  const fromSlug = searchParams.get('from') ?? undefined;
  /** `?shape=…&w=…` — вернулись из оформления заказа «Изменить» */
  const fromUrl = useMemo(() => (fromSlug ? null : parseConfigSearchParams(searchParams)), [fromSlug, searchParams]);
  const { data: product, isPending, isError, error } = useProductQuery(fromSlug);

  const base = useMemo(
    () =>
      product
        ? { config: configFromProduct(product), label: `«${product.name}» ${formatFootprint(product.dimensions)}` }
        : null,
    [product],
  );

  return {
    isLoading: Boolean(fromSlug) && isPending,
    /** форма пересоздаётся при смене исходной модели или конфигурации из адреса */
    formKey: base ? `from-${product?.slug}` : fromUrl ? `url-${toConfigSearchParams(fromUrl).toString()}` : 'default',
    initial: base?.config ?? fromUrl ?? DEFAULT_CONFIG,
    baseLabel: base?.label,
    fallbackNotice:
      fromSlug && isError
        ? isNotFoundError(error)
          ? 'Модель не найдена — начните с базовых параметров.'
          : 'Не удалось загрузить модель — показаны базовые параметры.'
        : null,
  };
}
