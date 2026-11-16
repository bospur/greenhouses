import { Controller } from 'react-hook-form';
import { FormField, Input, TextArea } from '@/shared/ui';
import { formatPhoneInput } from '../../domain';
import { CheckoutSection } from './CheckoutSection';
import type { CheckoutFormLogic } from './useLogic';
import styles from './CheckoutForm.module.css';

const IDS = { name: 'checkout-name', phone: 'checkout-phone', email: 'checkout-email', comment: 'checkout-comment' };

export function ContactsStep({ logic }: { logic: CheckoutFormLogic }) {
  const { form } = logic;
  const { errors } = form.formState;

  return (
    <CheckoutSection index={2} title="Контакты" done={logic.progress.contacts}>
      <div className={styles.row}>
        <FormField label="Имя" htmlFor={IDS.name} error={errors.name?.message}>
          <Input
            id={IDS.name}
            autoComplete="name"
            placeholder="Иван Петров"
            invalid={Boolean(errors.name)}
            {...form.register('name')}
          />
        </FormField>
        <Controller
          control={form.control}
          name="phone"
          render={({ field, fieldState }) => (
            <FormField
              label="Телефон"
              htmlFor={IDS.phone}
              error={fieldState.error?.message}
              hint="Позвоним, чтобы подтвердить заказ"
            >
              <Input
                id={IDS.phone}
                ref={field.ref}
                name={field.name}
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="+7 (___) ___-__-__"
                value={field.value}
                invalid={Boolean(fieldState.error)}
                onChange={(e) => field.onChange(formatPhoneInput(e.target.value))}
                onBlur={field.onBlur}
              />
            </FormField>
          )}
        />
      </div>
      <FormField
        label="Email"
        htmlFor={IDS.email}
        optional
        error={errors.email?.message}
        hint="Пришлём чек и статус заказа"
      >
        <Input
          id={IDS.email}
          type="email"
          autoComplete="email"
          placeholder="you@example.ru"
          invalid={Boolean(errors.email)}
          {...form.register('email')}
        />
      </FormField>
      <FormField label="Комментарий к заказу" htmlFor={IDS.comment} optional error={errors.comment?.message}>
        <TextArea
          id={IDS.comment}
          rows={3}
          placeholder="Удобное время для звонка, подъезд к участку…"
          invalid={Boolean(errors.comment)}
          {...form.register('comment')}
        />
      </FormField>
    </CheckoutSection>
  );
}
