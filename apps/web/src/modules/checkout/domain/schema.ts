import { z } from 'zod';
import type { CityDTO, DeliveryService } from '@/data/repositories/delivery';
import type { PaymentMethod } from '@/data/repositories/orders';
import { isCompletePhone } from './phone';

export const PAYMENT_METHODS = ['sbp', 'card'] as const satisfies readonly PaymentMethod[];

export type CheckoutFormValues = {
  city: CityDTO | null;
  quoteId: string;
  /** тариф выбранной котировки — от него зависит, нужен ли адрес */
  deliveryService: DeliveryService | '';
  address: string;
  name: string;
  phone: string;
  email: string;
  comment: string;
  paymentMethod: PaymentMethod;
};

export const CHECKOUT_DEFAULTS: CheckoutFormValues = {
  city: null,
  quoteId: '',
  deliveryService: '',
  address: '',
  name: '',
  phone: '',
  email: '',
  comment: '',
  paymentMethod: 'sbp',
};

export const ADDRESS_MIN_LENGTH = 5;

export const checkoutSchema = z
  .object({
    city: z
      .object({ id: z.string(), name: z.string(), region: z.string() })
      .nullable()
      .refine((c) => c !== null, 'Выберите город из списка'),
    quoteId: z.string().min(1, 'Выберите способ доставки'),
    deliveryService: z.enum(['door', 'terminal', 'pickup']).or(z.literal('')),
    address: z.string().max(200, 'Слишком длинный адрес'),
    name: z
      .string()
      .refine((v) => v.trim().length >= 2, 'Укажите имя')
      .refine((v) => v.trim().length <= 80, 'Слишком длинное имя'),
    phone: z.string().refine(isCompletePhone, 'Введите номер полностью: +7 (XXX) XXX-XX-XX'),
    email: z.string().refine((v) => !v.trim() || z.email().safeParse(v.trim()).success, 'Проверьте адрес почты'),
    comment: z.string().max(500, 'Не больше 500 символов'),
    paymentMethod: z.enum(PAYMENT_METHODS),
  })
  .superRefine((v, ctx) => {
    if (v.deliveryService === 'door' && v.address.trim().length < ADDRESS_MIN_LENGTH) {
      ctx.addIssue({ code: 'custom', path: ['address'], message: 'Укажите улицу, дом и квартиру или участок' });
    }
  }) satisfies z.ZodType<CheckoutFormValues>;

const STEP_FIELDS = {
  delivery: ['city', 'quoteId', 'address'],
  contacts: ['name', 'phone', 'email', 'comment'],
  payment: ['paymentMethod'],
} as const satisfies Record<string, readonly (keyof CheckoutFormValues)[]>;

export type CheckoutStepId = keyof typeof STEP_FIELDS;

/** Какие шаги заполнены без ошибок — для индикатора над формой */
export function getCheckoutProgress(values: CheckoutFormValues): Record<CheckoutStepId, boolean> {
  const issues = checkoutSchema.safeParse(values).error?.issues ?? [];
  const failed = new Set(issues.map((i) => i.path[0]));
  const isDone = (step: CheckoutStepId) => STEP_FIELDS[step].every((field) => !failed.has(field));
  const delivery = isDone('delivery');
  const contacts = isDone('contacts');
  // способ оплаты выбран по умолчанию — шаг считаем пройденным, когда до него дошли
  return { delivery, contacts, payment: delivery && contacts && isDone('payment') };
}
