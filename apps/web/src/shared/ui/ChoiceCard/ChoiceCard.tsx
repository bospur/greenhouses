import type { ReactNode } from 'react';
import { cn } from '@/shared/utils';
import { Icon } from '../Icon';
import styles from './ChoiceCard.module.css';

export type ChoiceCardProps = {
  type?: 'radio' | 'checkbox';
  name: string;
  checked: boolean;
  disabled?: boolean;
  title: ReactNode;
  description?: ReactNode;
  /** справа от заголовка: цена, доплата, иконка */
  meta?: ReactNode;
  /** картинка над заголовком; на узких экранах карточка сжимается до картинки и заголовка */
  media?: ReactNode;
  size?: 'md' | 'sm';
  onChange: () => void;
};

/** Карточка выбора: нативный radio/checkbox внутри label — стрелки, Tab и пробел работают из коробки */
export function ChoiceCard({
  type = 'radio',
  name,
  checked,
  disabled,
  title,
  description,
  meta,
  media,
  size = 'md',
  onChange,
}: ChoiceCardProps) {
  return (
    <label
      className={cn(
        styles.card,
        size === 'sm' && styles.small,
        media != null && styles.withMedia,
        checked && styles.active,
        disabled && styles.disabled,
      )}
    >
      <input
        type={type}
        name={name}
        className={styles.input}
        checked={checked}
        disabled={disabled}
        onChange={onChange}
      />
      {media != null && <span className={styles.media}>{media}</span>}
      <span className={styles.head}>
        <span className={cn(styles.mark, type === 'checkbox' && styles.markSquare)} aria-hidden="true">
          {type === 'checkbox' && checked && <Icon name="check" size={12} strokeWidth={3} />}
        </span>
        <span className={styles.title}>{title}</span>
        {meta != null && <span className={styles.meta}>{meta}</span>}
      </span>
      {description != null && <span className={styles.description}>{description}</span>}
    </label>
  );
}
