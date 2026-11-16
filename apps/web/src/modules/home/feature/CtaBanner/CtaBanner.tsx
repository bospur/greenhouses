import { APP_ROUTES } from '@/shared/constants';
import { Button, Container, Icon, Reveal } from '@/shared/ui';
import { CTA_CONTENT } from '../../domain';
import styles from './CtaBanner.module.css';

export function CtaBanner() {
  return (
    <section className={styles.section}>
      <Container>
        <Reveal className={styles.banner}>
          <svg className={styles.blueprint} viewBox="0 0 400 200" aria-hidden="true">
            <path d="M40 180V95a160 85 0 0 1 320 0v85" />
            <path d="M80 180V110a120 65 0 0 1 240 0v70" />
            <path d="M20 190h360M40 196v-12M360 196v-12" />
          </svg>
          <h2>{CTA_CONTENT.title}</h2>
          <p>{CTA_CONTENT.text}</p>
          <Button to={APP_ROUTES.configurator.path} variant="light" size="lg">
            Открыть конфигуратор <Icon name="arrowRight" size={18} />
          </Button>
        </Reveal>
      </Container>
    </section>
  );
}
