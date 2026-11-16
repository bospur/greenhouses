const SIZE = 29;
const FINDER = 7;

function hashSeed(text: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0 || 1;
}

function finderCell(x: number, y: number): boolean | null {
  const corners = [
    [0, 0],
    [SIZE - FINDER, 0],
    [0, SIZE - FINDER],
  ];
  for (const [cx, cy] of corners) {
    const lx = x - cx;
    const ly = y - cy;
    // кольцо-разделитель вокруг «глазка» всегда пустое
    if (lx >= -1 && lx <= FINDER && ly >= -1 && ly <= FINDER) {
      if (lx < 0 || ly < 0 || lx === FINDER || ly === FINDER) return false;
      const ring = lx === 0 || ly === 0 || lx === FINDER - 1 || ly === FINDER - 1;
      const core = lx >= 2 && lx <= 4 && ly >= 2 && ly <= 4;
      return ring || core;
    }
  }
  return null;
}

/**
 * Псевдо-QR для мока: узнаваемый вид (три «глазка», тайминг), узор зависит от payload.
 * Не сканируется — в C1 заменить на настоящий код из ответа ЮKassa.
 */
export function buildMockQrPath(payload: string): { size: number; path: string } {
  let state = hashSeed(payload);
  const random = () => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    return (state >>> 0) / 0xffffffff;
  };

  let path = '';
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      const finder = finderCell(x, y);
      const timing = x === 6 || y === 6 ? (x + y) % 2 === 0 : null;
      const filled = finder ?? timing ?? random() < 0.48;
      if (filled) path += `M${x} ${y}h1v1h-1z`;
    }
  }
  return { size: SIZE, path };
}
