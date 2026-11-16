import { useEffect } from 'react';
import { COMPANY } from '@/shared/constants';

const DEFAULT_PAGE_TITLE = `${COMPANY.name} — теплицы с доставкой по России`;
const DEFAULT_PAGE_DESCRIPTION =
  'Качественные теплицы с доставкой по России. Стандартные модели и теплицы по вашим размерам с чертежом и расчётом цены онлайн.';

type PageMetaProps = {
  /** без названия магазина — оно добавится само; без title — заголовок главной */
  title?: string;
  description?: string;
  /** оформление и заказы — личные страницы, им не место в поиске */
  noIndex?: boolean;
};

/**
 * `<title>` — через React 19 (поднимается в `<head>`), description — правкой тега из `index.html`:
 * второй `<meta name="description">` поисковики не ждут.
 */
export function PageMeta({ title, description = DEFAULT_PAGE_DESCRIPTION, noIndex }: PageMetaProps) {
  useEffect(() => {
    const tag = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!tag) return;
    tag.content = description;
    return () => {
      tag.content = DEFAULT_PAGE_DESCRIPTION;
    };
  }, [description]);

  return (
    <>
      <title>{title ? `${title} — ${COMPANY.name}` : DEFAULT_PAGE_TITLE}</title>
      {noIndex && <meta name="robots" content="noindex" />}
    </>
  );
}
