/** Геометрия CSS-3D арочной теплицы: полуцилиндр из плоских панелей вдоль оси Z. */

export type ScenePanel = {
  key: string;
  width: number;
  height: number;
  transform: string;
};

export type Scene3DGeometry = {
  radius: number;
  length: number;
  panels: ScenePanel[];
  /** z-координаты промежуточных дуг каркаса */
  ribsZ: number[];
};

export function buildArchScene(radius: number, length: number, segments: number, ribs: number): Scene3DGeometry {
  const step = 180 / segments;
  const halfStepRad = ((step / 2) * Math.PI) / 180;
  const chord = 2 * radius * Math.sin(halfStepRad);
  const apothem = radius * Math.cos(halfStepRad);

  const panels: ScenePanel[] = Array.from({ length: segments }, (_, i) => {
    const angle = -90 + step / 2 + i * step;
    return {
      key: `p${i}`,
      // +1px перекрытие убирает щели между панелями при сглаживании
      width: chord + 1,
      height: length,
      transform: `rotateZ(${angle}deg) translateY(${-apothem}px) rotateX(90deg)`,
    };
  });

  const ribsZ = Array.from({ length: ribs }, (_, i) => -length / 2 + ((i + 1) * length) / (ribs + 1));

  return { radius, length, panels, ribsZ };
}
