import type { ReactNode } from 'react';
import { cn } from '@/shared/utils';
import styles from './SectionHeading.module.css';

type SectionHeadingProps = {
  tag?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  align?: 'left' | 'center';
  as?: 'h1' | 'h2';
  className?: string;
};

export function SectionHeading({
  tag,
  title,
  subtitle,
  align = 'left',
  as: Heading = 'h2',
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn(styles.heading, align === 'center' && styles.center, className)}>
      {tag && <span className={styles.tag}>{tag}</span>}
      <Heading className={cn(styles.title, Heading === 'h1' && styles.titleLarge)}>{title}</Heading>
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
    </div>
  );
}
