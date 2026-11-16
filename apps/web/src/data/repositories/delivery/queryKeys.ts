import type { CargoDTO } from './dto';

export const deliveryKeys = {
  all: ['delivery'] as const,
  cities: (query: string) => [...deliveryKeys.all, 'cities', query.trim().toLowerCase()] as const,
  quotes: (cityId: string, cargo: CargoDTO | null) => [...deliveryKeys.all, 'quotes', cityId, cargo] as const,
};
