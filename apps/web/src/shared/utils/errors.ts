/** Запрошенная сущность не существует (404 от API или отсутствует в моках). */
export class NotFoundError extends Error {
  constructor(message = 'Не найдено') {
    super(message);
    this.name = 'NotFoundError';
  }
}

export function isNotFoundError(error: unknown): error is NotFoundError {
  return error instanceof NotFoundError;
}

/** Тексты Chrome / Firefox / Safari и Vite, когда чанк маршрута не загрузился (обычно — после деплоя) */
const CHUNK_LOAD_ERROR =
  /dynamically imported module|Importing a module script failed|Unable to preload CSS|error loading dynamically/i;

export function isChunkLoadError(error: unknown): boolean {
  return error instanceof Error && CHUNK_LOAD_ERROR.test(error.message);
}
