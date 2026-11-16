/** Имитация сетевого запроса: случайная задержка и копия данных (чтобы кеш не мутировал моки). */
export function mockRequest<T>(getData: () => T, minDelayMs = 300, maxDelayMs = 650): Promise<T> {
  const delay = minDelayMs + Math.random() * (maxDelayMs - minDelayMs);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        resolve(structuredClone(getData()));
      } catch (error) {
        reject(error);
      }
    }, delay);
  });
}

export class MockNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'MockNotFoundError';
  }
}
