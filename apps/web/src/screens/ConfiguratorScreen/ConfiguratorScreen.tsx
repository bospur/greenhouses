import { Configurator } from '@/modules/configurator';
import { COMPANY } from '@/shared/constants';
import { Container, SectionHeading } from '@/shared/ui';
import styles from './ConfiguratorScreen.module.css';

export function ConfiguratorScreen() {
  return (
    <Container className={styles.page}>
      <title>{`Конфигуратор теплицы — ${COMPANY.name}`}</title>
      <SectionHeading
        as="h1"
        tag="Конфигуратор"
        title="Соберите свою теплицу"
        subtitle="Меняйте параметры — чертёж и цена обновляются сразу"
        className={styles.heading}
      />
      <Configurator />
    </Container>
  );
}
