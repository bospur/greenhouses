import { Configurator } from '@/modules/configurator';
import { Container, PageMeta, SectionHeading } from '@/shared/ui';
import styles from './ConfiguratorScreen.module.css';

export function ConfiguratorScreen() {
  return (
    <Container className={styles.page}>
      <PageMeta
        title="Конфигуратор теплицы"
        description="Соберите теплицу по своим размерам: форма, каркас, поликарбонат, двери и форточки. Чертёж и цена обновляются сразу."
      />
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
