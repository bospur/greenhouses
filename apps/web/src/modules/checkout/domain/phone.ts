const NATIONAL_LENGTH = 10;

/** Десять цифр номера без кода страны; ведущие 7/8 считаем кодом страны */
export function getNationalDigits(value: string): string {
  let digits = value.replace(/\D/g, '');
  if (value.trimStart().startsWith('+7') || ((digits[0] === '7' || digits[0] === '8') && digits.length > 1)) {
    digits = digits.slice(1);
  } else if (digits === '7' || digits === '8') {
    digits = '';
  }
  return digits.slice(0, NATIONAL_LENGTH);
}

/**
 * Маска «+7 (999) 123-45-67» по мере ввода. Разделитель добавляется только перед следующей цифрой —
 * иначе Backspace упирается в скобку или дефис.
 */
export function formatPhoneInput(value: string): string {
  const d = getNationalDigits(value);
  // в пустом поле набрали 7 или 8 — показываем префикс; стёрли до префикса — очищаем поле
  if (d.length === 0) return /\d/.test(value) && !value.trimStart().startsWith('+7') ? '+7 (' : '';
  let out = `+7 (${d.slice(0, 3)}`;
  if (d.length > 3) out += `) ${d.slice(3, 6)}`;
  if (d.length > 6) out += `-${d.slice(6, 8)}`;
  if (d.length > 8) out += `-${d.slice(8, 10)}`;
  return out;
}

export function isCompletePhone(value: string): boolean {
  return getNationalDigits(value).length === NATIONAL_LENGTH;
}

/** +79991234567 — формат для API */
export function toE164Phone(value: string): string {
  return `+7${getNationalDigits(value)}`;
}
