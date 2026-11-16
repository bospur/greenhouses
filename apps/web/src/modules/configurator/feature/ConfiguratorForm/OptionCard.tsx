import type { ReactNode } from 'react';
import { Icon } from '@/shared/ui';
import { cn } from '@/shared/utils';
import styles from './controls.module.css';

type OptionCardProps = {
  type: 'radio' | 'checkbox';
  name: string;
  checked: boolean;
  disabled?: boolean;
  title: string;
  description?: string;
  /** справа от заголовка: доплата, «включено» */
  meta?: ReactNode;
  media?: ReactNode;
  onChange: () => void;
};

export function OptionCard({ type, name, checked, disabled, title, description, meta, media, onChange }: OptionCardProps) {
  return (
    <label className={cn(styles.card, checked && styles.cardActive, disabled && styles.disabled)}>
      <input
        type={type}
        name={name}
        className={styles.srOnly}
        checked={checked}
        disabled={disabled}
        onChange={onChange}
      />
      {media && <span className={styles.cardMedia}>{media}</span>}
      <span className={styles.cardBody}>
        <span className={styles.cardHead}>
          <span className={cn(styles.mark, type === 'checkbox' && styles.markSquare)} aria-hidden="true">
            {checked && <Icon name="check" size={12} strokeWidth={3} />}
          </span>
          <span className={styles.cardTitle}>{title}</span>
          {meta && <span className={styles.cardMeta}>{meta}</span>}
        </span>
        {description && <span className={styles.cardDescription}>{description}</span>}
      </span>
    </label>
  );
}
