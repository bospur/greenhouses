import { useEffect, useRef, useState, type ReactNode } from 'react';
import { cn } from '@/shared/utils';
import styles from './Reveal.module.css';

type RevealProps = {
  children: ReactNode;
  /** задержка появления, мс — для «лесенки» в сетках */
  delay?: number;
  className?: string;
};

const supportsObserver = typeof window !== 'undefined' && 'IntersectionObserver' in window;

export function Reveal({ children, delay = 0, className }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(!supportsObserver);

  useEffect(() => {
    const el = ref.current;
    if (!el || !supportsObserver) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn(styles.reveal, visible && styles.visible, className)}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
