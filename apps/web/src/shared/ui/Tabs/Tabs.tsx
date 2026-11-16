import { useRef, type KeyboardEvent, type ReactNode } from 'react';
import { cn } from '@/shared/utils';
import { getTabIds } from './tabIds';
import styles from './Tabs.module.css';

export type TabItem<T extends string> = {
  id: T;
  label: ReactNode;
};

type TabsProps<T extends string> = {
  items: readonly TabItem<T>[];
  value: T;
  onChange: (id: T) => void;
  /** префикс id для связи вкладки и панели, см. `getTabIds` */
  idPrefix: string;
  label: string;
  className?: string;
};

export function Tabs<T extends string>({ items, value, onChange, idPrefix, label, className }: TabsProps<T>) {
  const listRef = useRef<HTMLDivElement>(null);

  const focusTab = (index: number) => {
    const next = items[(index + items.length) % items.length];
    if (!next) return;
    onChange(next.id);
    listRef.current?.querySelector<HTMLButtonElement>(`#${getTabIds(idPrefix, next.id).tabId}`)?.focus();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const moves: Record<string, number> = {
      ArrowRight: index + 1,
      ArrowLeft: index - 1,
      Home: 0,
      End: items.length - 1,
    };
    const target = moves[e.key];
    if (target === undefined) return;
    e.preventDefault();
    focusTab(target);
  };

  return (
    <div ref={listRef} role="tablist" aria-label={label} className={cn(styles.list, className)}>
      {items.map((item, index) => {
        const selected = item.id === value;
        const { tabId, panelId } = getTabIds(idPrefix, item.id);
        return (
          <button
            key={item.id}
            id={tabId}
            type="button"
            role="tab"
            aria-selected={selected}
            aria-controls={selected ? panelId : undefined}
            tabIndex={selected ? 0 : -1}
            className={cn(styles.tab, selected && styles.active)}
            onClick={() => onChange(item.id)}
            onKeyDown={(e) => handleKeyDown(e, index)}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
