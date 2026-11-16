import type { ReactNode } from 'react';
import { Icon } from '@/shared/ui';
import { cn } from '@/shared/utils';
import styles from './CheckoutForm.module.css';

type CheckoutSectionProps = {
  index: number;
  title: string;
  done: boolean;
  children: ReactNode;
};

export function CheckoutSection({ index, title, done, children }: CheckoutSectionProps) {
  const headingId = `checkout-step-${index}`;
  return (
    <section className={styles.section} aria-labelledby={headingId}>
      <h2 id={headingId} className={styles.sectionTitle}>
        <span className={cn(styles.num, done && styles.numDone)} aria-hidden="true">
          {done ? <Icon name="check" size={14} strokeWidth={3} /> : index}
        </span>
        {title}
      </h2>
      <div className={styles.sectionBody}>{children}</div>
    </section>
  );
}
