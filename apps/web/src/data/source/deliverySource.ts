import { ENV } from '@/shared/config/env';
import { axiosInstance } from './axiosInstance';
import { buildMockQuotes, searchMockCities } from './mock/deliveryMock';
import { mockRequest } from './mock/mockRequest';

export type CityNetworkDTO = {
  id: string;
  name: string;
  region: string;
};

export type DeliveryServiceNetwork = 'door' | 'terminal' | 'pickup';

export type CargoNetworkDTO = {
  weightKg: number;
  volumeM3: number;
};

export type DeliveryQuotesRequestNetworkDTO = {
  cityId: string;
  cargo: CargoNetworkDTO;
};

export type DeliveryQuoteNetworkDTO = {
  /** стабилен для пары «город + тариф» — по нему заказ ссылается на котировку */
  id: string;
  carrier: string;
  carrierName: string;
  service: DeliveryServiceNetwork;
  costRub: number;
  etaDaysMin: number;
  etaDaysMax: number;
};

export async function fetchCities(q: string): Promise<CityNetworkDTO[]> {
  if (ENV.useMocks) {
    return mockRequest(() => searchMockCities(q), 150, 350);
  }
  const { data } = await axiosInstance.get<CityNetworkDTO[]>('/api/v1/delivery/cities', { params: { q } });
  return data;
}

export async function postDeliveryQuotes(body: DeliveryQuotesRequestNetworkDTO): Promise<DeliveryQuoteNetworkDTO[]> {
  if (ENV.useMocks) {
    return mockRequest(() => buildMockQuotes(body), 600, 1100);
  }
  const { data } = await axiosInstance.post<DeliveryQuoteNetworkDTO[]>('/api/v1/delivery/quotes', body);
  return data;
}
