export type CityDTO = {
  id: string;
  name: string;
  region: string;
};

export type DeliveryService = 'door' | 'terminal' | 'pickup';

/** Оценка груза для расчёта ТК */
export type CargoDTO = {
  weightKg: number;
  volumeM3: number;
};

export type DeliveryQuoteDTO = {
  id: string;
  carrier: string;
  carrierName: string;
  service: DeliveryService;
  cost: number;
  etaDays: { min: number; max: number };
};
