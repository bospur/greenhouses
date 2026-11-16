import { Icon } from '@/shared/ui';
import { cn } from '@/shared/utils';
import type { CheckoutStepId } from '../../domain';
import styles from './CheckoutForm.module.css';

const STEPS: readonly { id: 'item' | CheckoutStepId; label: string }[] = [
  { id: 'item', label: 'Теплица' },
  { id: 'delivery', label: 'Доставка' },
  { id: 'contacts', label: 'Контакты' },
  { id: 'payment', label: 'Оплата' },
];

export function CheckoutProgress({ progress }: { progress: Record<CheckoutStepId, boolean> }) {
  const done = (id: (typeof STEPS)[number]['id']) => id === 'item' || progress[id];
  const current = STEPS.find((s) => !done(s.id))?.id;

  return (
    <ol className={styles.progress} aria-label="Шаги оформления">
      {STEPS.map((step, i) => (
        <li
          key={step.id}
          className={cn(
            styles.progressStep,
            done(step.id) && styles.progressDone,
            step.id === current && styles.progressCurrent,
          )}
          aria-current={step.id === current ? 'step' : undefined}
        >
          {done(step.id) ? <Icon name="check" size={14} strokeWidth={2.5} /> : <span aria-hidden="true">{i + 1}.</span>}
          {step.label}
        </li>
      ))}
    </ol>
  );
}
