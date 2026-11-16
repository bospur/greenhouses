import { isAxiosError } from 'axios';

export function getApiErrorMessage(error: unknown, fallback = 'Не удалось загрузить данные'): string {
  if (isAxiosError(error)) {
    if (!error.response) return 'Нет соединения с сервером';
    const data: unknown = error.response.data;
    if (typeof data === 'string' && data) return data;
    if (data && typeof data === 'object' && 'error' in data) {
      const err = (data as { error: unknown }).error;
      if (typeof err === 'string') return err;
      if (err && typeof err === 'object' && 'message' in err) {
        return String((err as { message: unknown }).message);
      }
    }
    if (data && typeof data === 'object' && 'message' in data) {
      return String((data as { message: unknown }).message);
    }
    return fallback;
  }
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}
