import { fetchCities, postDeliveryQuotes, type DeliveryQuoteNetworkDTO } from '@/data/source/deliverySource';
import type { CargoDTO, CityDTO, DeliveryQuoteDTO } from './dto';

function mapQuoteFromNetwork(row: DeliveryQuoteNetworkDTO): DeliveryQuoteDTO {
  return {
    id: row.id,
    carrier: row.carrier,
    carrierName: row.carrierName,
    service: row.service,
    cost: row.costRub,
    etaDays: { min: row.etaDaysMin, max: row.etaDaysMax },
  };
}

class DeliveryRepository {
  async searchCities(query: string): Promise<CityDTO[]> {
    return fetchCities(query.trim());
  }

  async getQuotes(cityId: string, cargo: CargoDTO): Promise<DeliveryQuoteDTO[]> {
    const rows = await postDeliveryQuotes({ cityId, cargo });
    return rows.map(mapQuoteFromNetwork);
  }
}

export const deliveryRepository = new DeliveryRepository();
