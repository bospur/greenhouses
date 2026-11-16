import type { ReactNode } from 'react';
import { Container } from '../Container';
import { SectionHeading } from '../SectionHeading';
import styles from './PagePlaceholder.module.css';

type PagePlaceholderProps = {
  title: string;
  description: string;
  session: string;
  children?: ReactNode;
};

/** Временная заглушка экрана до его реализации по PLAN.md */
export function PagePlaceholder({ title, description, session, children }: PagePlaceholderProps) {
  return (
    <Container className={styles.wrap}>
      <SectionHeading as="h1" tag={`В разработке · сессия ${session}`} title={title} subtitle={description} />
      <div className={styles.box}>{children ?? 'Экран появится в следующих сессиях'}</div>
    </Container>
  );
}
