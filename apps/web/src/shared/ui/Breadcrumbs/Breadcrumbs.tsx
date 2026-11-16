import { Fragment } from 'react';
import { Link } from 'react-router';
import styles from './Breadcrumbs.module.css';

export type BreadcrumbItem = {
  label: string;
  /** без `to` — текущая страница */
  to?: string;
};

type BreadcrumbsProps = {
  items: BreadcrumbItem[];
};

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Навигационная цепочка" className={styles.nav}>
      <ol className={styles.list}>
        {items.map((item, i) => (
          <Fragment key={`${item.label}-${i}`}>
            {i > 0 && (
              <li aria-hidden="true" className={styles.sep}>
                /
              </li>
            )}
            <li>
              {item.to ? (
                <Link to={item.to} className={styles.link}>
                  {item.label}
                </Link>
              ) : (
                <span aria-current="page" className={styles.current}>
                  {item.label}
                </span>
              )}
            </li>
          </Fragment>
        ))}
      </ol>
    </nav>
  );
}
