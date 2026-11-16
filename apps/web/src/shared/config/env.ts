const apiUrl = (import.meta.env.VITE_API_URL ?? '').trim();

export const ENV = {
  apiUrl,
  useMocks: apiUrl === '',
} as const;
