import { useMemo } from 'react';
import type { GreenhouseShape, ProductDimensions } from '@/data/repositories/catalog';
import { cn } from '@/shared/utils';
import { buildProductDrawing, type DrawingViewId } from '../../domain';
import { DrawingViewSvg, MAX_ZOOM } from './DrawingViewSvg';
import styles from './ProductDrawing.module.css';

const DEFAULT_ROWS: readonly (readonly DrawingViewId[])[] = [['front', 'top']];

type ProductDrawingProps = {
  shape: GreenhouseShape;
  dimensions: ProductDimensions;
  doors: number;
  vents?: number;
  /** виды по строкам; ширина строки пропорциональна её содержимому — масштаб общий для всех видов */
  rows?: readonly (readonly DrawingViewId[])[];
  className?: string;
};

export function ProductDrawing({
  shape,
  dimensions,
  doors,
  vents = 0,
  rows = DEFAULT_ROWS,
  className,
}: ProductDrawingProps) {
  const drawing = useMemo(
    () => buildProductDrawing(shape, dimensions, { doors, vents }),
    [shape, dimensions, doors, vents],
  );

  const rowWidths = rows.map((ids) => ids.reduce((sum, id) => sum + drawing[id].viewBox.width, 0));
  const widest = Math.max(...rowWidths);

  return (
    <div className={cn(styles.sheet, className)}>
      {rows.map((ids, i) => (
        <div
          key={ids.join('-')}
          className={styles.row}
          style={{ width: `${(rowWidths[i] / widest) * 100}%`, maxWidth: rowWidths[i] * MAX_ZOOM }}
        >
          {ids.map((id) => (
            <DrawingViewSvg key={id} view={drawing[id]} />
          ))}
        </div>
      ))}
    </div>
  );
}
