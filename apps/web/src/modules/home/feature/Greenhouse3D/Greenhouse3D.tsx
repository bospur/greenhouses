import type { CSSProperties } from 'react';
import { buildArchScene } from '../../domain';
import styles from './Greenhouse3D.module.css';

const SCENE = buildArchScene(105, 290, 12, 4);

const centered = (width: number, height: number, transform: string): CSSProperties => ({
  width,
  height,
  marginLeft: -width / 2,
  marginTop: -height / 2,
  transform,
});

/** Половина диска (торец/дуга) стоит на земле (y = 0) */
const halfDisk = (r: number, z: number): CSSProperties => ({
  width: r * 2,
  height: r,
  marginLeft: -r,
  marginTop: -r,
  borderRadius: `${r}px ${r}px 0 0`,
  transform: `translateZ(${z}px)`,
});

type Greenhouse3DProps = {
  hint?: string;
};

export function Greenhouse3D({ hint }: Greenhouse3DProps) {
  const { radius: r, length: l, panels, ribsZ } = SCENE;

  return (
    <div className={styles.visual} aria-hidden="true">
      <div className={styles.stage}>
        <div className={styles.scene}>
          <div className={styles.ground} style={centered(r * 2 + 70, l + 70, 'rotateX(90deg)')} />

          {panels.map((p) => (
            <div key={p.key} className={styles.panel} style={centered(p.width, p.height, p.transform)} />
          ))}

          {ribsZ.map((z) => (
            <div key={z} className={styles.rib} style={halfDisk(r, z)} />
          ))}

          <div className={styles.endWall} style={halfDisk(r, -l / 2)} />
          <div className={styles.endWall} style={halfDisk(r, l / 2)}>
            <div className={styles.door} />
            <div className={styles.vent} />
          </div>
        </div>
      </div>
      {hint && <span className={styles.hint}>{hint}</span>}
    </div>
  );
}
