# ТеплицаПро — монорепа

Сайт продажи теплиц с доставкой по России: каталог стандартных моделей, конфигуратор
своих размеров с чертежом, оформление заказа с расчётом доставки через ТК и оплатой (ЮKassa).

| Путь | Что |
|------|-----|
| `apps/web` | фронтенд: Vite + React 19 + TS ([гайд](./FRONTEND_ARCHITECTURE_GUIDE.md)) |
| `apps/api` | бэкенд на Go (появится в фазе B) |
| `docs/session-context` | план работ и контекст сессий |
| `docs/adr` | архитектурные решения |

## Запуск фронта

```bash
npm install
npm run dev        # http://localhost:5173
npm run build
npm run lint
```

Без `VITE_API_URL` (см. `apps/web/.env.example`) фронт работает на моках.
