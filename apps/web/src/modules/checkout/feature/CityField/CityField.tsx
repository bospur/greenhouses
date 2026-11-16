import type { Ref } from 'react';
import type { CityDTO } from '@/data/repositories/delivery';
import { FormField, Icon, Input } from '@/shared/ui';
import { cn } from '@/shared/utils';
import { useCityFieldLogic } from './useLogic';
import styles from './CityField.module.css';

type CityFieldProps = {
  id: string;
  value: CityDTO | null;
  onChange: (city: CityDTO | null) => void;
  onBlur?: () => void;
  error?: string;
  /** RHF фокусирует поле при ошибке отправки */
  inputRef?: Ref<HTMLInputElement>;
};

/** Комбобокс с подсказками городов (паттерн WAI-ARIA combobox + listbox) */
export function CityField({ id, value, onChange, onBlur, error, inputRef }: CityFieldProps) {
  const logic = useCityFieldLogic({ value, onChange, onBlur });
  const listId = `${id}-listbox`;
  const optionId = (i: number) => `${id}-option-${i}`;

  return (
    <FormField
      label="Город или населённый пункт"
      htmlFor={id}
      error={error}
      hint={value ? `${value.name}, ${value.region}` : 'Начните вводить название и выберите из списка'}
    >
      <div className={styles.combobox}>
        <Icon name="search" size={18} className={styles.icon} />
        <Input
          id={id}
          ref={inputRef}
          type="text"
          role="combobox"
          autoComplete="off"
          placeholder="Например, Казань"
          className={styles.input}
          value={logic.text}
          invalid={Boolean(error)}
          aria-expanded={logic.isOpen}
          aria-controls={logic.isOpen ? listId : undefined}
          aria-autocomplete="list"
          aria-activedescendant={logic.activeIndex >= 0 ? optionId(logic.activeIndex) : undefined}
          onChange={(e) => logic.handleInput(e.target.value)}
          onKeyDown={logic.handleKeyDown}
          onFocus={logic.handleFocus}
          onBlur={logic.handleBlur}
        />
        {value && <Icon name="check" size={18} className={styles.selected} />}

        {logic.isOpen && (
          <div className={styles.popup}>
            {logic.options.length > 0 ? (
              <ul id={listId} role="listbox" aria-label="Подходящие города" className={styles.list}>
                {logic.options.map((city, i) => (
                  <li
                    key={city.id}
                    id={optionId(i)}
                    role="option"
                    aria-selected={i === logic.activeIndex}
                    className={cn(styles.option, i === logic.activeIndex && styles.optionActive)}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => logic.select(city)}
                  >
                    <span className={styles.optionName}>{city.name}</span>
                    <span className={styles.optionRegion}>{city.region}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p id={listId} className={styles.status} role="status">
                {logic.isSearching
                  ? 'Ищем…'
                  : (logic.errorMessage ?? 'Город не найден — проверьте написание или позвоните нам')}
              </p>
            )}
          </div>
        )}
      </div>
    </FormField>
  );
}
