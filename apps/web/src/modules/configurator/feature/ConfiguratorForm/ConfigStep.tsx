import type { ReactNode } from 'react';
import { Icon } from '@/shared/ui';
import styles from './ConfiguratorForm.module.css';

type ConfigStepProps = {
  index: number;
  title: string;
  notice: string[];
  children: ReactNode;
};

export function ConfigStep({ index, title, notice, children }: ConfigStepProps) {
  const headingId = `config-step-${index}`;
  return (
    <section className={styles.step} aria-labelledby={headingId}>
      <h2 id={headingId} className={styles.stepTitle}>
        <span className={styles.num} aria-hidden="true">
          {index}
        </span>
        {title}
      </h2>
      <div className={styles.stepBody}>{children}</div>
      <div role="status" className={styles.noticeSlot}>
        {notice.length > 0 && (
          <div className={styles.notice}>
            <Icon name="bolt" size={16} />
            <ul>
              {notice.map((text) => (
                <li key={text}>{text}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}

type FieldProps = {
  label: string;
  hint?: ReactNode;
  htmlFor?: string;
  children: ReactNode;
};

export function Field({ label, hint, htmlFor, children }: FieldProps) {
  const LabelTag = htmlFor ? 'label' : 'span';
  return (
    <div className={styles.field}>
      <LabelTag className={styles.label} {...(htmlFor ? { htmlFor } : {})}>
        {label}
      </LabelTag>
      {children}
      {hint && <p className={styles.hint}>{hint}</p>}
    </div>
  );
}
