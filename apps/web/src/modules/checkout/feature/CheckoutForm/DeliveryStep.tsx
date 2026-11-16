import { Controller } from 'react-hook-form';
import { COMPANY } from '@/shared/constants';
import { ChoiceCard, ErrorState, FormField, Icon, Input, Skeleton } from '@/shared/ui';
import { formatPrice } from '@/shared/utils';
import { DELIVERY_SERVICE_LABELS, formatEta } from '../../domain';
import { CityField } from '../CityField';
import { CheckoutSection } from './CheckoutSection';
import type { CheckoutFormLogic } from './useLogic';
import styles from './CheckoutForm.module.css';

const ADDRESS_ID = 'checkout-address';

export function DeliveryStep({ logic }: { logic: CheckoutFormLogic }) {
  const { form, values, selectedQuote, summary } = logic;
  const quoteError = form.formState.errors.quoteId?.message;
  const addressError = form.formState.errors.address?.message;

  return (
    <CheckoutSection index={1} title="Доставка" done={logic.progress.delivery}>
      <Controller
        control={form.control}
        name="city"
        render={({ field, fieldState }) => (
          <CityField
            id="checkout-city"
            inputRef={field.ref}
            value={field.value}
            onChange={logic.selectCity}
            onBlur={field.onBlur}
            error={fieldState.error?.message}
          />
        )}
      />

      {values.city && (
        <div className={styles.group} role="radiogroup" aria-label="Способ доставки" aria-busy={logic.isQuotesLoading}>
          <span className={styles.groupLabel}>Способ доставки</span>
          {logic.isQuotesLoading ? (
            <div className={styles.choiceList}>
              {[0, 1, 2].map((i) => (
                <Skeleton key={i} height={64} radius={12} />
              ))}
            </div>
          ) : logic.quotesError ? (
            <ErrorState message={logic.quotesError} onRetry={logic.retryQuotes} />
          ) : logic.quotes.length === 0 ? (
            <p className={styles.notice}>
              <Icon name="alert" size={16} />
              Транспортные компании не возят в этот город. Позвоните нам — подберём вариант: {COMPANY.phone}
            </p>
          ) : (
            <div className={styles.choiceList}>
              {logic.quotes.map((q) => (
                <ChoiceCard
                  key={q.id}
                  name="delivery-quote"
                  checked={q.id === values.quoteId}
                  title={q.carrierName}
                  description={`${DELIVERY_SERVICE_LABELS[q.service]} · ${formatEta(q.etaDays)}`}
                  meta={q.cost === 0 ? 'Бесплатно' : formatPrice(q.cost)}
                  onChange={() => logic.selectQuote(q)}
                />
              ))}
            </div>
          )}
          {quoteError && (
            <p className={styles.error} role="alert">
              {quoteError}
            </p>
          )}
          {logic.quotes.length > 0 && (
            <p className={styles.hint}>
              Груз ≈ {summary.cargo.weightKg} кг, {summary.cargo.volumeM3.toLocaleString('ru-RU')} м³. Стоимость
              предварительная — ТК уточнит её при приёмке.
            </p>
          )}
        </div>
      )}

      {selectedQuote?.service === 'door' && (
        <FormField label="Адрес доставки" htmlFor={ADDRESS_ID} error={addressError}>
          <Input
            id={ADDRESS_ID}
            autoComplete="street-address"
            placeholder="ул. Садовая, д. 5, кв. 12 или СНТ «Ромашка», уч. 48"
            invalid={Boolean(addressError)}
            {...form.register('address')}
          />
        </FormField>
      )}
      {selectedQuote?.service === 'terminal' && (
        <p className={styles.info}>
          <Icon name="mapPin" size={16} />
          Заберёте груз в терминале «{selectedQuote.carrierName}» в г. {values.city?.name}. Адрес терминала пришлём в
          SMS.
        </p>
      )}
      {selectedQuote?.service === 'pickup' && (
        <p className={styles.info}>
          <Icon name="mapPin" size={16} />
          Склад: {COMPANY.warehouseAddress}. Менеджер согласует с вами время.
        </p>
      )}
    </CheckoutSection>
  );
}
