import { Icon } from '@/shared/ui';
import { cn } from '@/shared/utils';
import styles from './PhotoPlaceholder.module.css';

type PhotoPlaceholderProps = {
  caption: string;
  compact?: boolean;
};

/** Временная плашка вместо фотографии, пока у моделей нет реальных снимков */
export function PhotoPlaceholder({ caption, compact = false }: PhotoPlaceholderProps) {
  return (
    <div className={cn(styles.placeholder, compact && styles.compact)}>
      <Icon name="camera" size={compact ? 18 : 36} />
      <span className={styles.caption}>{caption}</span>
      {!compact && <span className={styles.note}>Фото скоро появится</span>}
    </div>
  );
}
