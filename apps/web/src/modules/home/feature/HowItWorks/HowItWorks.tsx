import { Container, Icon, Reveal, SectionHeading } from '@/shared/ui';
import { HOW_IT_WORKS } from '../../domain';
import styles from './HowItWorks.module.css';

export function HowItWorks() {
  return (
    <section className={styles.section}>
      <Container>
        <Reveal>
          <SectionHeading
            align="center"
            tag="Как заказать"
            title="От выбора до грядок — 4 шага"
            subtitle="Без звонков и ожидания менеджера: всё считается онлайн."
          />
        </Reveal>
        <ol className={styles.steps}>
          {HOW_IT_WORKS.map((step, i) => (
            <li key={step.title}>
              <Reveal delay={i * 90} className={styles.step}>
                <div className={styles.iconWrap}>
                  <Icon name={step.icon} size={26} />
                  <span className={styles.num}>{i + 1}</span>
                </div>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
