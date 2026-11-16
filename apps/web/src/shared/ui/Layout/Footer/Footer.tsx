import { Link } from 'react-router';
import { COMPANY } from '@/shared/constants';
import { Container } from '../../Container';
import { Logo } from '../../Logo';
import { NAV_ITEMS } from '../navigation';
import styles from './Footer.module.css';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <Container>
        <div className={styles.grid}>
          <div className={styles.about}>
            <Logo inverted />
            <p>Качественные теплицы с доставкой по всей России. Стандартные модели и изготовление по вашим размерам.</p>
          </div>

          <div>
            <h4 className={styles.title}>Покупателям</h4>
            <ul className={styles.list}>
              {NAV_ITEMS.map((item) => (
                <li key={item.to}>
                  <Link to={item.to}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className={styles.title}>Контакты</h4>
            <ul className={styles.list}>
              <li>
                <a href={COMPANY.phoneHref} className={styles.phone}>
                  {COMPANY.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>
              </li>
              <li>{COMPANY.workHours}</li>
            </ul>
          </div>
        </div>

        <div className={styles.bottom}>
          <span>
            © {year} {COMPANY.name}
          </span>
          <span>Цены на сайте предварительные, итог фиксируется при оформлении заказа</span>
        </div>
      </Container>
    </footer>
  );
}
