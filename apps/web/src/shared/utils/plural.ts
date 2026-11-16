const rules = new Intl.PluralRules('ru-RU');

/** pluralize(5, ['модель', 'модели', 'моделей']) → «моделей» */
export function pluralize(count: number, [one, few, many]: readonly [string, string, string]): string {
  switch (rules.select(count)) {
    case 'one':
      return one;
    case 'few':
      return few;
    default:
      return many;
  }
}
