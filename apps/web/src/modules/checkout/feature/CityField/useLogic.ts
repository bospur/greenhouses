import { useState, type KeyboardEvent } from 'react';
import { CITY_QUERY_MIN_LENGTH, useCitySearchQuery, type CityDTO } from '@/data/repositories/delivery';
import { useDebouncedValue } from '@/shared/hooks';
import { getApiErrorMessage } from '@/shared/utils';

const SEARCH_DEBOUNCE_MS = 250;
const normalize = (s: string) => s.toLowerCase().replaceAll('ё', 'е').trim();

type CityFieldParams = {
  value: CityDTO | null;
  onChange: (city: CityDTO | null) => void;
  onBlur?: () => void;
};

export function useCityFieldLogic({ value, onChange, onBlur }: CityFieldParams) {
  const [text, setText] = useState(value?.name ?? '');
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const debounced = useDebouncedValue(text, SEARCH_DEBOUNCE_MS);

  const isSelectedText = value !== null && text === value.name;
  const tooShort = text.trim().length < CITY_QUERY_MIN_LENGTH;
  const query = useCitySearchQuery(debounced, { enabled: !isSelectedText });
  const options = isSelectedText || tooShort ? [] : (query.data ?? []);
  const isSearching = !tooShort && (debounced !== text || query.isFetching);
  const active = activeIndex < options.length ? activeIndex : -1;

  const select = (city: CityDTO) => {
    onChange(city);
    setText(city.name);
    setOpen(false);
    setActiveIndex(-1);
  };

  const handleInput = (next: string) => {
    setText(next);
    setOpen(true);
    setActiveIndex(-1);
    if (value) onChange(null);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setOpen(true);
        setActiveIndex(Math.min(options.length - 1, active + 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex(Math.max(0, active - 1));
        break;
      case 'Enter': {
        // Enter в поле города выбирает вариант, а не отправляет форму
        e.preventDefault();
        const target = options[active] ?? (options.length === 1 ? options[0] : undefined);
        if (open && target) select(target);
        break;
      }
      case 'Escape':
        if (open) {
          e.preventDefault();
          setOpen(false);
        }
        break;
    }
  };

  const handleBlur = () => {
    setOpen(false);
    if (!value) {
      const exact = options.find((o) => normalize(o.name) === normalize(text));
      if (exact) select(exact);
    }
    onBlur?.();
  };

  return {
    text,
    options,
    activeIndex: active,
    isOpen: open && !tooShort && !isSelectedText,
    isSearching,
    errorMessage: query.isError ? getApiErrorMessage(query.error, 'Не удалось загрузить список городов') : null,
    select,
    handleInput,
    handleKeyDown,
    handleBlur,
    handleFocus: () => setOpen(true),
  };
}
