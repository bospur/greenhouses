import styles from './PageLoader.module.css';

/** Заглушка экрана, пока грузится код маршрута; появляется с задержкой, чтобы не мигать на быстрой сети */
export function PageLoader() {
  return (
    <div className={styles.loader} role="status">
      <span className={styles.spinner} aria-hidden="true" />
      <span>Загружаем страницу…</span>
    </div>
  );
}
