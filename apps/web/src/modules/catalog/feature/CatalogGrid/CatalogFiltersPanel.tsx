import type { ReactNode } from 'react';
import { formatMeters, formatPrice, cn } from '@/shared/utils';
import { CATALOG_SORT_OPTIONS, PRICE_STEP, SHAPE_LABELS, type CatalogSort } from '../../domain';
import type { CatalogGridLogic } from './useLogic';
import styles from './CatalogFiltersPanel.module.css';

type CatalogFiltersPanelProps = {
  logic: CatalogGridLogic;
};

type ChipProps = {
  active: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: ReactNode;
};

function Chip({ active, disabled, onClick, children }: ChipProps) {
  return (
    <button
      type="button"
      className={cn(styles.chip, active && styles.chipActive)}
      aria-pressed={active}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function Group({ label, className, children }: { label: string; className?: string; children: ReactNode }) {
  return (
    <div className={cn(styles.group, className)} role="group" aria-label={label}>
      <span className={styles.groupLabel}>{label}</span>
      {children}
    </div>
  );
}

export function CatalogFiltersPanel({ logic }: CatalogFiltersPanelProps) {
  const { filters, facets, isLoading } = logic;
  const priceDisabled = isLoading || facets.priceMin === facets.priceMax;

  return (
    <div className={styles.panel}>
      <Group label="Форма">
        <div className={styles.chips}>
          <Chip active={filters.shape === null} disabled={isLoading} onClick={() => logic.toggleShape(null)}>
            Все
          </Chip>
          {facets.shapes.map((shape) => (
            <Chip key={shape} active={filters.shape === shape} onClick={() => logic.toggleShape(shape)}>
              {SHAPE_LABELS[shape]}
            </Chip>
          ))}
        </div>
      </Group>

      <Group label="Ширина">
        <div className={styles.chips}>
          <Chip active={filters.widthM === null} disabled={isLoading} onClick={() => logic.toggleWidth(null)}>
            Любая
          </Chip>
          {facets.widths.map((w) => (
            <Chip key={w} active={filters.widthM === w} onClick={() => logic.toggleWidth(w)}>
              {formatMeters(w)}
            </Chip>
          ))}
        </div>
      </Group>

      <Group label="Цена" className={styles.priceGroup}>
        <label className={styles.range}>
          <span className={styles.rangeValue}>
            до <strong>{isLoading ? '…' : formatPrice(logic.priceValue)}</strong>
          </span>
          <input
            type="range"
            min={facets.priceMin}
            max={facets.priceMax}
            step={PRICE_STEP}
            value={logic.priceValue}
            disabled={priceDisabled}
            onChange={(e) => logic.setPriceMax(Number(e.target.value))}
            aria-label="Максимальная цена"
            aria-valuetext={formatPrice(logic.priceValue)}
          />
        </label>
      </Group>

      <Group label="Сортировка">
        <select
          className={styles.select}
          value={filters.sort}
          onChange={(e) => logic.setSort(e.target.value as CatalogSort)}
          aria-label="Сортировка"
        >
          {CATALOG_SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </Group>
    </div>
  );
}
