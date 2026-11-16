# CURRENT — где остановились

**Обновлено:** 2026-11-16, после сессии A6 (фаза A закрыта)

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

### A6 — полировка
- **Роутинг (`App.tsx`):** главная и 404 — eager, остальные экраны — `route.lazy` + `HydrateFallback: PageLoader`;
  pathless-маршрут `ErrorBoundary: RouteError` вокруг страниц (layout остаётся). `vite.config.ts` —
  `codeSplitting.groups`: чанк `vendor` (react, react-dom, react-router, @tanstack, axios). zod / RHF в vendor не класть.
- **`RouteError`** (`shared/ui/Layout`): `isChunkLoadError` (`shared/utils/errors.ts`) → одна автоперезагрузка
  (метка `greenhouses-chunk-reload` в sessionStorage, пауза 30 с) → иначе экран «Сайт обновился»; прочие ошибки —
  «Что-то пошло не так».
- **`AppLayout`:** skip-link, фокус на `<main id="main">` при смене `pathname`, полоса прогресса навигации, слот
  `headerActions` → `Header actions` (место 40×40 резервируется). **Header:** мобильное меню — `visibility`, Escape,
  `aria-controls`; «Оформление заказа» убран из `NAV_ITEMS` (и из футера).
- **`OrderDraftLink`** (`modules/checkout/feature`): значок корзины + бейдж из `useOrderDraftStore`; в `App.tsx`
  через `React.lazy` + `Suspense fallback={null}`.
- **shared/ui:** `ChoiceCard` (заменил `OptionCard` и checkout-`ChoiceCard`; `type`, `meta`, `media`, `size`),
  `PageMeta` (title + description + `noIndex`), `PageLoader`. `<title>` напрямую больше нигде не пишется.
- `index.html`: og-теги, `theme-color`, `<noscript>`. `global.css`: reduced-motion → `animation-iteration-count: 1`.
- Prettier в корне (`.prettierrc.json`, `.prettierignore`), `npm run format` / `format:check`, шаг в CI. README обновлён.
- Сборка: `index` 68 kB (22 gzip) + `vendor` 410 kB (131 gzip); zod 138 kB и checkout 47 kB — отдельно.

## Деплой (dev)

- Репозиторий `git@github.com:bospur/greenhouses.git`, ветки `main` и `dev`. Пуш в `dev` → `.github/workflows/deploy-dev.yml`:
  `npm ci` → format:check → lint → typecheck → build → rsync `apps/web/dist` в `/var/www/dev.bospur.ru/releases/<sha>` →
  атомарная смена симлинка `current` → хранится 5 релизов → smoke `curl` по `/` и `/catalog/klassik-3x4`.
- Сайт `https://dev.bospur.ru` (basic auth, пользователь `bospur`). VPS `147.45.70.86` (Ubuntu 24.04), nginx + certbot
  (автопродление), ufw: OpenSSH + Nginx Full, вход только по ключу.
- Пользователь `deploy` владеет `/var/www/dev.bospur.ru`; ключ Actions — `~/.ssh/greenhouses_deploy` на Mac.
- Секреты в GitHub Environment `dev`: `SSH_HOST`, `SSH_USER`, `SSH_PRIVATE_KEY`, `SSH_KNOWN_HOSTS`, `BASIC_AUTH`;
  переменная `VITE_API_URL` (пока не задана — моки).
- nginx: `/etc/nginx/sites-available/dev.bospur.ru` — SPA-фолбэк на `index.html`, `/assets/` с immutable-кешем.
  С lazy-чанками важно, чтобы сам `index.html` отдавался без долгого кеша (`no-cache`) — не проверено на сервере;
  на случай старой вкладки после деплоя есть автоперезагрузка в `RouteError`.
  Откат: на сервере `ln -sfn releases/<старый_sha> current` в `/var/www/dev.bospur.ru`.

## Следующий шаг

**Фаза A закрыта.** Следующая сессия — **B1 — каркас API** (`apps/api`, Go):
1. Go-модуль, `chi`, конфиг из env, `slog`, `GET /healthz`, CORS для `apps/web`.
2. OpenAPI-контракт `apps/api/api/openapi.yaml` по текущим `*NetworkDTO` из `apps/web/src/data/source`
   (каталог, доставка, заказы, платёж); ошибки `{ error: { code, message } }`.
3. Postgres + миграции (`goose`), `docker-compose.yml` в корне (api + postgres).
4. Добавить `apps/api` в README и CI (go vet / test), не ломая деплой фронта.

Отложено из A6 (можно взять отдельной сессией в любой момент): тёмная тема-переключатель — токены
`[data-theme='dark']` есть, нужен проход по всем светлым экранам (формы, чертежи, карточки) и хранение выбора.

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
- CSS Modules с `localsConvention: 'camelCaseOnly'` — классы вида `badge_paid` превращаются в `badgePaid`;
  динамические имена классов не собирать строкой, а мапить явно.
- Мок оплаты: окно оплаты сам переключается на «Оплата прошла» через ~10 с (опрос `useOrderQuery`).
  Тестовые заказы лежат в localStorage `greenhouses-mock-orders`; черновик — `greenhouses-order-draft`.
- Котировки мока живут в памяти модуля: после HMR / перезагрузки между расчётом и отправкой мок вернёт
  «Стоимость доставки устарела» — это ожидаемо (выбрать доставку заново).
- QR в окне оплаты — псевдо-узор, не сканируется (настоящий — из ответа ЮKassa в C1).
- Импорт из `@/modules/checkout` (barrel) в eager-код тянет весь модуль и zod в основной бандл — только через lazy.
  Проверять составом чанков после `npm run build` (`index-*.js` ≈ 68 kB).
- Встроенный браузер может рисовать только узкую полосу (~185 px): `fullPage` и `captureBeyondViewport` дают повтор
  кадра — скриншоты частями с `window.scrollTo`. После навигации `ScrollRestoration` сбрасывает прокрутку.
- Перед коммитом — `npm run format` (CI падает на `format:check`).

## Открытые вопросы

См. «Открытые вопросы к заказчику» в `PLAN.md` (ТК и склад, формула цены, SMS, юрлица, монтаж, бренд).
