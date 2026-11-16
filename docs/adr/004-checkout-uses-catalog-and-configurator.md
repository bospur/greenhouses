# ADR-004: Оформление заказа использует каталог и конфигуратор

- Status: accepted
- Date: 2026-11-16

## Context

`/checkout` показывает выбранную теплицу так же, как каталог и конфигуратор: заголовок, параметры,
цену-превью и чертёж. Товар бывает двух видов — модель каталога (`slug`) или своя конфигурация
(`GreenhouseConfig`). Дублировать формулу цены, разбор конфигурации из URL и геометрию чертежа нельзя:
они разойдутся при первой же правке. GUIDE §10 требует фиксировать cross-module импорты.

## Decision

`modules/checkout` импортирует в одну сторону:

- из `@/modules/configurator/domain`: `GreenhouseConfig`, `calculatePrice`, `getConfigTitle`,
  `buildConfigSpecs`, `parseConfigSearchParams` / `toConfigSearchParams`, `configShapeSchema`, `normalizeConfig`;
- из `@/modules/catalog/domain`: `SHAPE_LABELS`, `formatFootprint`;
- из `@/modules/catalog` (feature): `ProductDrawing`.

Domain оформления (`checkout/domain`) импортирует только `*/domain`, не barrels модулей — без React.
Обратные направления (`catalog`/`configurator` → `checkout`) запрещены: конфигуратор передаёт
конфигурацию в оформление через URL (`/checkout?shape=…`), оформление кладёт её в `orderDraft` (ADR-002).

Контракт заказа в `data/repositories/orders` описывает свою конфигурацию структурно
(`CustomGreenhouseDTO`) — repositories не импортируют modules; `GreenhouseConfig` ему совместим.

## Consequences

- Цена своей теплицы в оформлении — та же функция, что в конфигураторе; источник истины — сервер (ADR-001),
  заказ отправляет `clientPreview` для сверки.
- Изменение `GreenhouseConfig` или ключей URL затрагивает три модуля и persist-черновик
  (поднять `version` в `orderDraftStore`).
- Если появится четвёртый потребитель геометрии/описания теплицы — вынести их в отдельный модуль `greenhouse`.
