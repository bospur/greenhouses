import { Container, Icon } from '@/shared/ui';
import { TRUST_ITEMS } from '../../domain';
import styles from './TrustBar.module.css';

export function TrustBar() {
  return (
    <div className={styles.bar}>
      <Container>
        <ul className={styles.list}>
          {TRUST_ITEMS.map((item) => (
            <li key={item}>
              <Icon name="check" size={16} strokeWidth={2.5} className={styles.check} />
              {item}
            </li>
          ))}
        </ul>
      </Container>
    </div>
  );
}
