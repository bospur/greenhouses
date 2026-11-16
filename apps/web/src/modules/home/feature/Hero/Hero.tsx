import { APP_ROUTES } from '@/shared/constants';
import { Button, Container, Icon } from '@/shared/ui';
import { HERO_CONTENT } from '../../domain';
import { Greenhouse3D } from '../Greenhouse3D';
import styles from './Hero.module.css';

function TitleLine({ text, accent }: { text: string; accent: string }) {
  const index = text.indexOf(accent);
  if (index === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, index)}
      <span className={styles.accent}>{accent}</span>
      {text.slice(index + accent.length)}
    </>
  );
}

export function Hero() {
  return (
    <section className={styles.hero}>
      <Container className={styles.grid}>
        <div>
          <div className={styles.badge}>
            <span className={styles.dot} />
            {HERO_CONTENT.badge}
          </div>

          <h1 className={styles.title}>
            {HERO_CONTENT.titleLines.map((line, i) => (
              <span key={line} className={styles.line} style={{ animationDelay: `${0.1 + i * 0.2}s` }}>
                <TitleLine text={line} accent={HERO_CONTENT.accentWords} />
              </span>
            ))}
          </h1>

          <p className={styles.description}>{HERO_CONTENT.description}</p>

          <div className={styles.actions}>
            <Button to={APP_ROUTES.configurator.path} size="lg">
              Собрать свою теплицу <Icon name="arrowRight" size={18} />
            </Button>
            <Button to={APP_ROUTES.catalog.path} variant="ghost" size="lg">
              Смотреть каталог
            </Button>
          </div>

          <dl className={styles.stats}>
            {HERO_CONTENT.stats.map((s) => (
              <div key={s.label}>
                <dt>{s.value}</dt>
                <dd>{s.label}</dd>
              </div>
            ))}
          </dl>
        </div>

        <Greenhouse3D hint={HERO_CONTENT.sceneHint} />
      </Container>
    </section>
  );
}
