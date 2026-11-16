# ТеплицаПро — монорепа

Сайт продажи теплиц с доставкой по России: каталог стандартных моделей, конфигуратор
своих размеров с чертежом, оформление заказа с расчётом доставки через ТК и оплатой (ЮKassa).

| Путь                    | Что                                                                       |
| ----------------------- | ------------------------------------------------------------------------- |
| `apps/web`              | фронтенд: Vite + React 19 + TS ([гайд](./FRONTEND_ARCHITECTURE_GUIDE.md)) |
| `apps/api`              | бэкенд на Go (появится в фазе B)                                          |
| `docs/session-context`  | план работ и контекст сессий                                              |
| `docs/adr`              | архитектурные решения                                                     |
| `.github/workflows`     | деплой ветки `dev` на `dev.bospur.ru`                                     |

## Запуск фронта

Нужен Node.js 24 (как в CI).

```bash
npm install
npm run dev            # http://localhost:5173
```

| Команда                | Что делает                                         |
| ---------------------- | -------------------------------------------------- |
| `npm run dev`          | dev-сервер Vite                                    |
| `npm run build`        | проверка типов + production-сборка в `apps/web/dist` |
| `npm run lint`         | ESLint                                             |
| `npm run typecheck`    | `tsc` без сборки                                   |
| `npm run format`       | Prettier по всему репозиторию                      |
| `npm run format:check` | то же без записи — запускается в CI                |

## Данные: моки и API

Адрес API задаётся в `apps/web/.env.local` (образец — `apps/web/.env.example`):

```bash
VITE_API_URL=http://localhost:8080
```

Пока `VITE_API_URL` пустой, фронт работает на моках из `apps/web/src/data/source/mock`:

- каталог — 6 моделей, задержка ответа 300–650 мс;
- доставка — ~55 городов, тарифы СДЭК / Деловые Линии / ПЭК считаются от склада в Подольске;
- заказы хранятся в `localStorage` (`greenhouses-mock-orders`); оплата подтверждается сама через ~10 секунд,
  QR-код в окне оплаты — декоративный.

Черновик заказа (выбранная теплица) лежит в `localStorage` под ключом `greenhouses-order-draft`.

## Структура `apps/web/src`

```
App.tsx          роутер: главная и 404 — в основном бандле, остальные экраны — lazy-чанки
screens/         страницы — только композиция модулей
modules/         домены: catalog, configurator, checkout, home (domain/ — чистые функции, feature/ — UI + useLogic)
data/source/     HTTP и моки (*NetworkDTO)
data/repositories/  маппинг в DTO, queryKeys, хуки React Query
shared/          ui-кит, константы (APP_ROUTES, COMPANY), утилиты, стили и токены
```

Правила слоёв, состояния и импортов — в [FRONTEND_ARCHITECTURE_GUIDE.md](./FRONTEND_ARCHITECTURE_GUIDE.md),
исключения из них — в `docs/adr/`.
