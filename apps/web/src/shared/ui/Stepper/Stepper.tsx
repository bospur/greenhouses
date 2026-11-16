import { cn } from '@/shared/utils';
import styles from './Stepper.module.css';

type StepperProps = {
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  /** подпись значения: «4 м», «2 шт.» */
  format?: (value: number) => string;
  label: string;
  id?: string;
  className?: string;
};

export function Stepper({ value, min, max, step = 1, onChange, format = String, label, id, className }: StepperProps) {
  const change = (delta: number) => onChange(Math.min(max, Math.max(min, value + delta)));

  return (
    <div className={cn(styles.stepper, className)} role="group" aria-label={label} id={id}>
      <button
        type="button"
        className={styles.button}
        onClick={() => change(-step)}
        disabled={value <= min}
        aria-label={`Уменьшить: ${label}`}
      >
        −
      </button>
      <output className={styles.value} aria-live="polite">
        {format(value)}
      </output>
      <button
        type="button"
        className={styles.button}
        onClick={() => change(step)}
        disabled={value >= max}
        aria-label={`Увеличить: ${label}`}
      >
        +
      </button>
    </div>
  );
}
