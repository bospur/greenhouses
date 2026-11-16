import { cn } from '@/shared/utils';
import styles from './controls.module.css';

export type ChoiceChipOption<T extends string | number> = {
  value: T;
  label: string;
  disabled?: boolean;
};

type ChoiceChipsProps<T extends string | number> = {
  name: string;
  label: string;
  options: readonly ChoiceChipOption<T>[];
  value: T;
  onChange: (value: T) => void;
};

/** Радиогруппа в виде чипов: нативные radio — стрелки и Tab работают из коробки */
export function ChoiceChips<T extends string | number>({ name, label, options, value, onChange }: ChoiceChipsProps<T>) {
  return (
    <div className={styles.chips} role="radiogroup" aria-label={label}>
      {options.map((o) => (
        <label key={o.value} className={cn(styles.chip, o.value === value && styles.chipActive, o.disabled && styles.disabled)}>
          <input
            type="radio"
            name={name}
            className={styles.srOnly}
            checked={o.value === value}
            disabled={o.disabled}
            onChange={() => onChange(o.value)}
          />
          {o.label}
        </label>
      ))}
    </div>
  );
}
