# CURRENT — где остановились

**Обновлено:** 2026-11-16, после сессии A5

## Проект

Сайт продажи теплиц (каталог, конфигуратор с чертежом, заказ с доставкой ТК и оплатой ЮKassa).
Монорепа: `apps/web` (React, профиль `spa-app`), `apps/api` (Go, фаза B — ещё не создан).
Контекст фронта — GUIDE §12. План — `PLAN.md`. Решения — `docs/adr/`.

## Сделано

### A1 — каркас
- npm workspaces, `apps/web`: Vite 8, React 19, TS 6, React Router 8, TanStack Query 5, RHF + Zod 4, Zustand 5, axios.
- Токены (`shared/styles/tokens.css`), шрифты Inter + Manrope, `APP_ROUTES`, `COMPANY`, `ENV.useMocks`.
- `shared/ui`: Button, Container, SectionHeading, Logo, AppLayout (Header + бургер, Footer), PagePlaceholder.

### A2 — главная + данные каталога
- **Data layer каталога:**
  - `data/source/catalogSource.ts` — `ProductNetworkDTO` (размеры в мм, `priceRub`), `fetchProducts({ popular })`, `fetchProduct(slug)`;
    при `ENV.useMocks` берёт `mock/catalogMock.ts` (6 моделей) через `mockRequest` (задержка 300–650 мс), иначе axios `/api/v1/products`.
  - `data/repositories/catalog/` — `ProductDTO` (`dto.ts`, размеры в метрах), `CatalogRepository` (маппинг), `catalogKeys`,
    `useProductsQuery`, `useProductQuery`.
- **`modules/catalog`:**
  - domain: `SHAPE_LABELS`, `formatFootprint`, `getFootprintArea`, `getDiscountPercent`, `buildIllustration` (аксонометрия SVG по форме и размерам).
  - feature: `GreenhouseIllustration` (SVG вместо фото-заглушек; формы arch / drop / gable), `ProductCard` (+ Skeleton),
    `PopularProducts` (+ useLogic: loading / error / retry).
- **`modules/home`:**
  - domain: `content.ts` (все тексты главной), `scene3d.ts` (`buildArchScene` — полуцилиндр из панелей).
  - feature: `Hero` (тёмный, анимация строк, статистика), `Greenhouse3D` (CSS-3D арочная теплица, вращение, пауза при наведении),
    `TrustBar`, `Features`, `HowItWorks` (4 шага), `DeliveryBlock` (ТК-чипы), `CtaBanner`.
- **`shared/ui`:** `Reveal` (IntersectionObserver), `Icon` (набор SVG-иконок), `Skeleton`, `ErrorState`; `shared/utils/getApiErrorMessage`.
- `APP_ROUTES.checkout.withProduct(slug)` — кнопка «Заказать» ведёт на `/checkout?product=slug` (обработка в A5).
- `HomeScreen` — только композиция: Hero → TrustBar → Features → PopularProducts → HowItWorks → DeliveryBlock → CtaBanner.
- Проверено в браузере: десктоп 1024 и мобильный 390. Lint / typecheck / build — зелёные.

### A3 — каталог + карточка модели
- **`/catalog`** (`CatalogScreen` → `CatalogGrid` + `CatalogFiltersPanel` + useLogic): форма / ширина / «цена до» / сортировка,
  состояние в URL (`shape`, `width`, `price_max`, `sort`; `replace` + `preventScrollReset`), счётчик, сброс, пустое состояние.
  Фильтрация на клиенте — чистые функции в `domain/filters.ts` (`parseCatalogFilters`, `toCatalogSearchParams`,
  `applyCatalogFilters`, `getCatalogFacets`).
- **`/catalog/:slug`** (`ProductScreen` → `ProductDetails key={slug}`): `ProductGallery` (схема + `PhotoPlaceholder` по `photos`),
  `ProductSummary` (цена/скидка/наличие, «Заказать», «Изменить размеры»), `ProductTabs` (характеристики из `domain/specs.ts`,
  чертёж, комплектация, фото → открывает в галерее), `ProductDetailsSkeleton`, `ProductNotFound` (404).
- **Чертёж:** `domain/drawing.ts` → `buildProductDrawing(shape, dims, doors)` (виды спереди и сверху, общий масштаб 46 px/м,
  размерные линии); рендер — `feature/ProductDrawing`. Контур торца — `domain/profile.ts` (`profilePath`, общий с иллюстрацией).
- **Данные:** `CatalogRepository.getProduct` → `NotFoundError` (`shared/utils/errors.ts`) на mock-404 и HTTP 404;
  `useProductQuery` без ретраев на 404 и с `placeholderData` из кеша списка.
- **shared:** `Tabs` (+ `getTabIds`), `Breadcrumbs`, `pluralize`, иконки `camera` / `close` / `sliders`.
- `<title>` через React 19 на каталоге, модели и 404. Проверено: 1024 и 390, lint / typecheck / build зелёные.

### A4 — конфигуратор
- **`modules/configurator/domain`** (pure): `types.ts` (`GreenhouseConfig`: shape, widthM, lengthM, heightM, frame,
  polycarbonateMm, doors, vents, options), `options.ts` (`SHAPE_LIMITS`, `LENGTH_RANGE` шаг 1 м, `FRAME_OPTIONS`,
  `POLYCARBONATE_OPTIONS`, `EXTRA_OPTIONS`, `DEFAULT_CONFIG`), `constraints.ts` (`getFrameRequirement`, `getMaxVents`,
  `normalizeConfig` → `{ config, adjustments }`), `pricing.ts` (`calculatePrice` → строки + итог, `getPriceDelta`,
  формула-заглушка), `schema.ts` (`configShapeSchema` — типы, `configSchema` — + ограничения), `fromProduct.ts`
  (`configFromProduct`), `searchParams.ts` (`toConfigSearchParams` / `parseConfigSearchParams` — короткие ключи
  `shape,w,l,h,frame,poly,doors,vents,opt`), `describe.ts` (`getConfigTitle`, `buildConfigSpecs`, `getSnowLoad`).
- **feature:** `Configurator` (+ useLogic: `?from=slug` → `useProductQuery` → `ConfiguratorForm key=slug`, скелетон,
  пояснение при 404/ошибке) и `ConfiguratorForm` (+ useLogic: RHF + zodResolver, `update(step, patch)` → normalize →
  `form.reset`; пояснения автоподстройки у шага). Подкомпоненты: `SizeStep`, `MaterialsStep`, `OpeningsStep`,
  `ExtrasStep`, `PriceSummary` (+ `MobilePriceBar`), `ConfiguratorPreview` (sticky чертёж + «Итого / В заказ»),
  `ConfigStep`/`Field`, `ChoiceChips`, `OptionCard` (нативные radio/checkbox внутри label).
- **Каталог:** `buildProductDrawing(shape, dims, { doors, vents })` → `{ front, side, top }`; форточки (`splitVents`);
  `ProductDrawing` — props `vents`, `rows` (общий масштаб по строкам). Импорт `configurator → catalog` — ADR-003.
- **shared:** `Stepper`, `formatPriceDelta`, `APP_ROUTES.checkout.withConfig(query)`.
- «В заказ» → `/checkout?shape=…&w=…`. Проверено: 1024 и 390, lint / typecheck / build зелёные.

### A5 — оформление заказа
- **Data layer:**
  - `data/source/deliverySource.ts` — `fetchCities(q)`, `postDeliveryQuotes({ cityId, cargo })`; мок
    `mock/deliveryMock.ts` (≈55 городов с расстоянием от склада, тарифы СДЭК / ДЛ / ПЭК, самовывоз ≤120 км;
    помнит выданные котировки).
  - `data/source/orderSource.ts` — `postOrder`, `fetchOrder`, `postOrderPayment`; мок `mock/orderMock.ts`
    (заказы в localStorage `greenhouses-mock-orders`, платёж подтверждается сам через 10 с, живёт 15 мин).
  - `data/repositories/delivery/` — `CityDTO`, `DeliveryQuoteDTO`, `CargoDTO`; `useCitySearchQuery` (≥2 символа,
    `keepPreviousData`), `useDeliveryQuotesQuery(cityId, cargo)`.
  - `data/repositories/orders/` — `OrderDTO`, `PaymentDTO`, `CreateOrderInput` (своя конфигурация — структурный
    `CustomGreenhouseDTO`); `useOrderQuery` (опрос 3 с, пока платёж `pending`), `useCreateOrderMutation`,
    `useCreatePaymentMutation` (оба пишут в кеш RQ).
- **`modules/checkout/domain`:** `orderItem.ts` (`OrderItem`, `parseOrderItemSearchParams`, `getOrderItemKey`,
  `parseStoredOrderItem`), `orderDraftStore.ts` (`useOrderDraftStore`: persist `greenhouses-order-draft`, `version: 1`,
  `merge` валидирует и нормализует), `summary.ts` (`summarizeProduct` / `summarizeConfig` → `OrderItemSummary`:
  подпись, цена, параметры, чертёж, груз, ссылка «Изменить»), `cargo.ts` (`estimateCargo`), `phone.ts`
  (маска, `isCompletePhone`, `toE164Phone`), `schema.ts` (`checkoutSchema`, `CHECKOUT_DEFAULTS`, `getCheckoutProgress`),
  `labels.ts` (тарифы, сроки, способы оплаты, статусы, `buildOrderTimeline`), `qr.ts` (`buildMockQrPath`).
- **feature:** `Checkout` (+ useLogic: URL → черновик → `replace`, загрузка модели, состояния empty / loading /
  notFound / error / ready; `EmptyCheckout`, `CheckoutSkeleton`), `CheckoutForm` (+ useLogic: RHF + zodResolver,
  котировки, `selectCity` / `selectQuote`, submit = заказ → платёж → `/order/:id?pay=1` → очистка черновика;
  `CheckoutProgress`, `CheckoutSection`, `DeliveryStep`, `ContactsStep`, `PaymentStep`, `ChoiceCard`,
  `OrderItemCard`, `OrderTotals`), `CityField` (+ useLogic: комбобокс), `OrderStatus` (+ useLogic: заказ,
  таймлайн, `PaymentDialog` с QR / картой / успехом / истёкшим платежом; `OrderNotFound`).
- **Конфигуратор:** `useConfiguratorLogic` берёт конфигурацию из `?shape=…` (если нет `?from=`).
- **shared:** `FormField` / `Input` / `TextArea`, `Modal` (`<dialog>`), `shared/hooks/useDebouncedValue`,
  `formatDateTime` / `formatTime`, новые иконки, `APP_ROUTES.configurator.withConfig`, `APP_ROUTES.order.pay`,
  `COMPANY.warehouseAddress`, `DELIVERY_QUOTES_LIFETIME_MS`, `ORDER_PAYMENT_POLL_MS`.
- Cross-module `checkout → configurator/catalog` — ADR-004. Проверено: 1024 и 390, путь модель → заказ → оплата,
  своя конфигурация → «Изменить» → конфигуратор; lint / typecheck / build зелёные.

## Следующий шаг

**A6 — полировка** (последняя сессия фазы A):
1. Lazy-роуты (`React.lazy` / `route.lazy`) — бандл 670 kB, предупреждение Vite > 500 kB.
2. Адаптив и a11y-проход по всем экранам (фокус после навигации, `prefers-reduced-motion`, контраст), SEO-мета
   (description / og) и `<title>` на главной.
3. Счётчик / ссылка на черновик в шапке (`useOrderDraftStore`), тёмная тема-переключатель (опц.).
4. Свести `OptionCard` конфигуратора и `ChoiceCard` оформления в общий `shared/ui` компонент.
5. Prettier + README (запуск, структура, моки, env).

## Заметки

- Dev-сервер: `npm run dev` в корне. В этой среде браузер открывает сайт по `http://[::1]:5173/`.
- Встроенный браузер IDE рисует кадры по запросу: CSS-переходы `Reveal` могут «застыть» на скриншоте — сделать второй скриншот.
- Границы импортов: типы товара — в `data/repositories/catalog/dto.ts` (repositories не импортируют modules);
  `PopularProducts` живёт в `catalog`, а главная собирает модули на уровне screen. Единственный cross-module импорт —
  `configurator → catalog` (ADR-003); domain конфигуратора берёт только `@/modules/catalog/domain`.
- Header: размытие фона в `::before` (иначе ломается `position: fixed` мобильного меню).
- ESLint `react-hooks` v7: никаких синхронных `setState` в `useEffect`; не возвращать `ref` из `useLogic` в общем объекте
  (правило `react-hooks/refs` ругается на любое чтение `logic.*` в рендере) — в `ProductDetails` скролл к галерее по `id`.
- Flex-контейнер с `flex-wrap: wrap` растягивает строку по самому широкому элементу — для мобильной колонки ставить `nowrap`.
- Скриншоты встроенного браузера могут поймать скелетон (моки 300–650 мс) — делать повторный снимок.
- Встроенный браузер не кликает по визуально скрытым `input` (карточки/чипы конфигуратора) — кликать по координатам
  или через `Runtime.evaluate`. При `Emulation.setDeviceMetricsOverride` координаты кликов смещаются — кликать по ref.
- Цены моков каталога не согласованы с формулой конфигуратора (совпадает только «Классик») — ждём вопрос №2.
- `npm run build` предупреждает о бандле > 500 kB — lazy-роуты в A6.
- CSS Modules с `localsConvention: 'camelCaseOnly'` — классы вида `badge_paid` превращаются в `badgePaid`;
  динамические имена классов не собирать строкой, а мапить явно.
- Мок оплаты: окно оплаты сам переключается на «Оплата прошла» через ~10 с (опрос `useOrderQuery`).
  Тестовые заказы лежат в localStorage `greenhouses-mock-orders`; черновик — `greenhouses-order-draft`.
- Котировки мока живут в памяти модуля: после HMR / перезагрузки между расчётом и отправкой мок вернёт
  «Стоимость доставки устарела» — это ожидаемо (выбрать доставку заново).
- QR в окне оплаты — псевдо-узор, не сканируется (настоящий — из ответа ЮKassa в C1).

## Открытые вопросы

См. «Открытые вопросы к заказчику» в `PLAN.md` (ТК и склад, формула цены, SMS, юрлица, монтаж, бренд).
