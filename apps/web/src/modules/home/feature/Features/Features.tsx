import { Container, Icon, Reveal, SectionHeading } from '@/shared/ui';
import { FEATURES } from '../../domain';
import styles from './Features.module.css';

export function Features() {
  return (
    <section className={styles.section}>
      <Container>
        <Reveal>
          <SectionHeading
            tag="Почему мы"
            title="Скорость. Удобство. Надёжность."
            subtitle="Всё, что важно при покупке теплицы, — прозрачно и без сюрпризов."
          />
        </Reveal>
        <div className={styles.grid}>
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={i * 70}>
              <div className={styles.card}>
                <span className={styles.icon}>
                  <Icon name={f.icon} />
                </span>
                <h3>{f.title}</h3>
                <p>{f.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
