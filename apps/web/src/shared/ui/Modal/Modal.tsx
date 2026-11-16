import { useEffect, useRef, type ReactNode } from 'react';
import { cn } from '@/shared/utils';
import { Icon } from '../Icon';
import styles from './Modal.module.css';

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  className?: string;
};

/** Нативный `<dialog>`: фокус-ловушка, Esc и инертный фон — из коробки */
export function Modal({ open, onClose, title, children, className }: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      className={styles.dialog}
      aria-labelledby="modal-title"
      onClose={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={cn(styles.body, className)}>
        <button type="button" className={styles.close} onClick={onClose} aria-label="Закрыть">
          <Icon name="close" size={20} />
        </button>
        <h2 id="modal-title" className={styles.title}>
          {title}
        </h2>
        {children}
      </div>
    </dialog>
  );
}
