const rubFormatter = new Intl.NumberFormat('ru-RU', {
  style: 'currency',
  currency: 'RUB',
  maximumFractionDigits: 0,
});

export function formatPrice(value: number): string {
  return rubFormatter.format(value);
}

/** «+2 800 ₽» / «−1 200 ₽»; ноль — пустая строка */
export function formatPriceDelta(delta: number): string {
  if (delta === 0) return '';
  return `${delta > 0 ? '+' : '−'}${rubFormatter.format(Math.abs(delta))}`;
}

const dateTimeFormatter = new Intl.DateTimeFormat('ru-RU', {
  day: 'numeric',
  month: 'long',
  hour: '2-digit',
  minute: '2-digit',
});

/** «16 ноября, 16:20» */
export function formatDateTime(iso: string): string {
  return dateTimeFormatter.format(new Date(iso));
}

const timeFormatter = new Intl.DateTimeFormat('ru-RU', { hour: '2-digit', minute: '2-digit' });

export function formatTime(iso: string): string {
  return timeFormatter.format(new Date(iso));
}

export function formatMeters(value: number): string {
  return `${value.toLocaleString('ru-RU', { maximumFractionDigits: 2 })} м`;
}
