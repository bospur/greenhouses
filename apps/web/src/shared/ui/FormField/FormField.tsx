import type { InputHTMLAttributes, ReactNode, Ref, TextareaHTMLAttributes } from 'react';
import { cn } from '@/shared/utils';
import styles from './FormField.module.css';

type FormFieldProps = {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: ReactNode;
  optional?: boolean;
  className?: string;
  children: ReactNode;
};

/** Подпись + поле + ошибка; id ошибки — `${htmlFor}-error` для aria-describedby */
export function FormField({ label, htmlFor, error, hint, optional, className, children }: FormFieldProps) {
  return (
    <div className={cn(styles.field, className)}>
      <label className={styles.label} htmlFor={htmlFor}>
        {label}
        {optional && <span className={styles.optional}> — необязательно</span>}
      </label>
      {children}
      {error ? (
        <p className={styles.error} id={`${htmlFor}-error`} role="alert">
          {error}
        </p>
      ) : (
        hint && <p className={styles.hint}>{hint}</p>
      )}
    </div>
  );
}

const describedBy = (id: string | undefined, invalid: boolean | undefined) =>
  invalid && id ? `${id}-error` : undefined;

type InputProps = InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean; ref?: Ref<HTMLInputElement> };

export function Input({ invalid, className, ...rest }: InputProps) {
  return (
    <input
      className={cn(styles.control, invalid && styles.invalid, className)}
      aria-invalid={invalid || undefined}
      aria-describedby={describedBy(rest.id, invalid)}
      {...rest}
    />
  );
}

type TextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  invalid?: boolean;
  ref?: Ref<HTMLTextAreaElement>;
};

export function TextArea({ invalid, className, ...rest }: TextAreaProps) {
  return (
    <textarea
      className={cn(styles.control, styles.textarea, invalid && styles.invalid, className)}
      aria-invalid={invalid || undefined}
      aria-describedby={describedBy(rest.id, invalid)}
      {...rest}
    />
  );
}
