import type { DimensionLine, DrawingView } from '../../domain';
import styles from './ProductDrawing.module.css';

/** Маленькие теплицы не раздуваем: подписи остаются читаемого размера */
export const MAX_ZOOM = 1.25;

function Dimension({ dim }: { dim: DimensionLine }) {
  const { labelAt } = dim;
  return (
    <g className={styles.dim}>
      {dim.extensions.map((s, i) => (
        <line key={i} {...s} />
      ))}
      <line {...dim.line} />
      <path d={dim.ticks} className={styles.tick} />
      <text
        x={labelAt.x}
        y={labelAt.y}
        className={styles.dimLabel}
        transform={dim.vertical ? `rotate(-90 ${labelAt.x} ${labelAt.y})` : undefined}
      >
        {dim.label}
      </text>
    </g>
  );
}

export function DrawingViewSvg({ view }: { view: DrawingView }) {
  const { width, height } = view.viewBox;
  return (
    <figure className={styles.view} style={{ flexGrow: width }}>
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={view.title} className={styles.svg}>
        <text x={view.titleAt.x} y={view.titleAt.y} className={styles.title}>
          {view.title}
        </text>
        {view.ground && <line {...view.ground} className={styles.ground} />}
        <path d={view.outline} className={styles.outline} />
        {view.hidden.map((d, i) => (
          <path key={i} d={d} className={styles.hidden} />
        ))}
        {view.axes.map((s, i) => (
          <line key={i} {...s} className={styles.axis} />
        ))}
        {view.openings.map((b, i) => (
          <rect key={i} {...b} className={styles.opening} />
        ))}
        {view.vents.map((b, i) => (
          <rect key={i} {...b} className={styles.vent} />
        ))}
        {view.dimensions.map((dim, i) => (
          <Dimension key={i} dim={dim} />
        ))}
      </svg>
    </figure>
  );
}
