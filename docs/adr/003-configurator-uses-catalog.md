# ADR-003: Конфигуратор переиспользует чертёж и иллюстрации каталога

- Status: accepted
- Date: 2026-11-16

## Context

Конфигуратору (A4) нужен тот же SVG-чертёж (торец, вид сбоку, вид сверху, размерные линии,
двери/форточки) и та же аксонометрия формы, что и карточке модели в каталоге. GUIDE §10 запрещает
импорт чужого `modules/*` без причины. Варианты:

1. Вынести геометрию в `shared/` — нельзя: она зависит от `GreenhouseShape` из `data/repositories/catalog`,
   а `shared` не импортирует `data`.
2. Завести отдельный модуль `greenhouse-geometry` — лишний слой ради двух потребителей.
3. Разрешить `configurator` импортировать из `catalog` в одну сторону.

## Decision

Вариант 3. `modules/configurator` может импортировать из `modules/catalog`:

- feature: `ProductDrawing` (props `rows`, `vents`), `GreenhouseIllustration`;
- domain: `SHAPE_LABELS`, `formatFootprint`, типы `DrawingViewId`.

Обратное направление (`catalog` → `configurator`) запрещено. Domain конфигуратора импортирует
только `@/modules/catalog/domain` (не barrel модуля), чтобы не тянуть React в чистый слой.

## Consequences

- Один источник геометрии: правка чертежа сразу видна и в карточке, и в конфигураторе.
- `buildProductDrawing(shape, dims, { doors, vents })` — публичный контракт каталога; при изменении
  сигнатуры проверять оба модуля.
- Если появится третий потребитель (например, PDF-чертёж в заказе), вынести геометрию в отдельный модуль.
