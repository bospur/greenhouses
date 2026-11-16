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
