import type { ReactNode } from 'react';
import { cn } from '@/shared/utils';
import styles from './choice.module.css';

type ChoiceCardProps = {
  name: string;
  checked: boolean;
  title: ReactNode;
  description?: ReactNode;
  /** справа: стоимость, срок */
  meta?: ReactNode;
  onChange: () => void;
};

/** Радио-карточка: нативный radio внутри label — стрелки и Tab работают из коробки */
export function ChoiceCard({ name, checked, title, description, meta, onChange }: ChoiceCardProps) {
  return (
    <label className={cn(styles.card, checked && styles.active)}>
      <input type="radio" name={name} className={styles.srOnly} checked={checked} onChange={onChange} />
      <span className={styles.mark} aria-hidden="true" />
      <span className={styles.body}>
        <span className={styles.title}>{title}</span>
        {description && <span className={styles.description}>{description}</span>}
      </span>
      {meta && <span className={styles.meta}>{meta}</span>}
    </label>
  );
}
