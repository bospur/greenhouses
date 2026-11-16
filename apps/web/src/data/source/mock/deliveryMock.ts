import type {
  CityNetworkDTO,
  DeliveryQuoteNetworkDTO,
  DeliveryQuotesRequestNetworkDTO,
  DeliveryServiceNetwork,
} from '../deliverySource';

/** Склад — Подольск (вопрос №1 к заказчику); расстояния по трассе, округлённо */
type MockCity = CityNetworkDTO & { distanceKm: number };

const city = (id: string, name: string, region: string, distanceKm: number): MockCity => ({ id, name, region, distanceKm });

const CITIES: readonly MockCity[] = [
  city('moscow', 'Москва', 'Москва', 40),
  city('podolsk', 'Подольск', 'Московская обл.', 0),
  city('khimki', 'Химки', 'Московская обл.', 60),
  city('mytishchi', 'Мытищи', 'Московская обл.', 65),
  city('kolomna', 'Коломна', 'Московская обл.', 110),
  city('serpukhov', 'Серпухов', 'Московская обл.', 65),
  city('sergiev-posad', 'Сергиев Посад', 'Московская обл.', 110),
  city('spb', 'Санкт-Петербург', 'Санкт-Петербург', 750),
  city('tver', 'Тверь', 'Тверская обл.', 210),
  city('tula', 'Тула', 'Тульская обл.', 150),
  city('kaluga', 'Калуга', 'Калужская обл.', 150),
  city('ryazan', 'Рязань', 'Рязанская обл.', 220),
  city('vladimir', 'Владимир', 'Владимирская обл.', 220),
  city('yaroslavl', 'Ярославль', 'Ярославская обл.', 310),
  city('ivanovo', 'Иваново', 'Ивановская обл.', 330),
  city('kostroma', 'Кострома', 'Костромская обл.', 380),
  city('smolensk', 'Смоленск', 'Смоленская обл.', 400),
  city('bryansk', 'Брянск', 'Брянская обл.', 360),
  city('orel', 'Орёл', 'Орловская обл.', 320),
  city('kursk', 'Курск', 'Курская обл.', 490),
  city('belgorod', 'Белгород', 'Белгородская обл.', 630),
  city('lipetsk', 'Липецк', 'Липецкая обл.', 440),
  city('voronezh', 'Воронеж', 'Воронежская обл.', 500),
  city('tambov', 'Тамбов', 'Тамбовская обл.', 470),
  city('nizhny-novgorod', 'Нижний Новгород', 'Нижегородская обл.', 450),
  city('vologda', 'Вологда', 'Вологодская обл.', 490),
  city('veliky-novgorod', 'Великий Новгород', 'Новгородская обл.', 560),
  city('pskov', 'Псков', 'Псковская обл.', 720),
  city('petrozavodsk', 'Петрозаводск', 'Республика Карелия', 1050),
  city('cheboksary', 'Чебоксары', 'Чувашская Республика', 700),
  city('kazan', 'Казань', 'Республика Татарстан', 840),
  city('penza', 'Пенза', 'Пензенская обл.', 650),
  city('saratov', 'Саратов', 'Саратовская обл.', 850),
  city('ulyanovsk', 'Ульяновск', 'Ульяновская обл.', 890),
  city('samara', 'Самара', 'Самарская обл.', 1070),
  city('volgograd', 'Волгоград', 'Волгоградская обл.', 960),
  city('rostov', 'Ростов-на-Дону', 'Ростовская обл.', 1060),
  city('krasnodar', 'Краснодар', 'Краснодарский край', 1330),
  city('sochi', 'Сочи', 'Краснодарский край', 1620),
  city('stavropol', 'Ставрополь', 'Ставропольский край', 1380),
  city('kirov', 'Киров', 'Кировская обл.', 960),
  city('izhevsk', 'Ижевск', 'Удмуртская Республика', 1180),
  city('ufa', 'Уфа', 'Республика Башкортостан', 1340),
  city('perm', 'Пермь', 'Пермский край', 1390),
  city('orenburg', 'Оренбург', 'Оренбургская обл.', 1460),
  city('ekaterinburg', 'Екатеринбург', 'Свердловская обл.', 1770),
  city('chelyabinsk', 'Челябинск', 'Челябинская обл.', 1760),
  city('tyumen', 'Тюмень', 'Тюменская обл.', 2100),
  city('omsk', 'Омск', 'Омская обл.', 2700),
  city('novosibirsk', 'Новосибирск', 'Новосибирская обл.', 3300),
  city('krasnoyarsk', 'Красноярск', 'Красноярский край', 4100),
  city('arkhangelsk', 'Архангельск', 'Архангельская обл.', 1230),
  city('murmansk', 'Мурманск', 'Мурманская обл.', 1950),
  city('kaliningrad', 'Калининград', 'Калининградская обл.', 1250),
];

const normalize = (s: string) => s.toLowerCase().replaceAll('ё', 'е').trim();

export function searchMockCities(q: string): CityNetworkDTO[] {
  const query = normalize(q);
  if (query.length < 2) return [];
  const starts = CITIES.filter((c) => normalize(c.name).startsWith(query));
  const contains = CITIES.filter((c) => !starts.includes(c) && normalize(`${c.name} ${c.region}`).includes(query));
  return [...starts, ...contains].slice(0, 8).map(({ id, name, region }) => ({ id, name, region }));
}

type Tariff = {
  carrier: string;
  carrierName: string;
  service: DeliveryServiceNetwork;
  baseRub: number;
  perKgRub: number;
  kmPerDay: number;
  handlingDays: number;
  maxDistanceKm: number;
};

const TARIFFS: readonly Tariff[] = [
  { carrier: 'cdek', carrierName: 'СДЭК', service: 'door', baseRub: 900, perKgRub: 9, kmPerDay: 700, handlingDays: 1, maxDistanceKm: 5000 },
  { carrier: 'cdek', carrierName: 'СДЭК', service: 'terminal', baseRub: 600, perKgRub: 7.5, kmPerDay: 700, handlingDays: 1, maxDistanceKm: 5000 },
  { carrier: 'dellin', carrierName: 'Деловые Линии', service: 'door', baseRub: 1400, perKgRub: 6.5, kmPerDay: 550, handlingDays: 2, maxDistanceKm: 5000 },
  { carrier: 'dellin', carrierName: 'Деловые Линии', service: 'terminal', baseRub: 700, perKgRub: 6, kmPerDay: 550, handlingDays: 2, maxDistanceKm: 5000 },
  { carrier: 'pek', carrierName: 'ПЭК', service: 'terminal', baseRub: 650, perKgRub: 5.5, kmPerDay: 500, handlingDays: 2, maxDistanceKm: 3500 },
];

const PICKUP_MAX_DISTANCE_KM = 120;
const roundTo10 = (v: number) => Math.round(v / 10) * 10;

/** Последние выданные котировки — заказ принимается только по ним (как будет на сервере) */
const issuedQuotes = new Map<string, DeliveryQuoteNetworkDTO & { cityId: string }>();

export function buildMockQuotes({ cityId, cargo }: DeliveryQuotesRequestNetworkDTO): DeliveryQuoteNetworkDTO[] {
  const target = CITIES.find((c) => c.id === cityId);
  if (!target) return [];

  const quotes: DeliveryQuoteNetworkDTO[] = TARIFFS.filter((t) => target.distanceKm <= t.maxDistanceKm).map((t) => {
    const etaDaysMin = t.handlingDays + Math.ceil(target.distanceKm / t.kmPerDay);
    const distanceFactor = 0.6 + target.distanceKm / 1000;
    return {
      id: `${t.carrier}-${t.service}-${cityId}`,
      carrier: t.carrier,
      carrierName: t.carrierName,
      service: t.service,
      costRub: roundTo10(t.baseRub + t.perKgRub * cargo.weightKg * distanceFactor + cargo.volumeM3 * 400),
      etaDaysMin,
      etaDaysMax: etaDaysMin + 2,
    };
  });

  if (target.distanceKm <= PICKUP_MAX_DISTANCE_KM) {
    quotes.unshift({
      id: `warehouse-pickup-${cityId}`,
      carrier: 'warehouse',
      carrierName: 'Самовывоз со склада',
      service: 'pickup',
      costRub: 0,
      etaDaysMin: 1,
      etaDaysMax: 2,
    });
  }

  for (const q of quotes) issuedQuotes.set(q.id, { ...q, cityId });
  return quotes.sort((a, b) => a.costRub - b.costRub);
}

export function findIssuedMockQuote(cityId: string, quoteId: string) {
  const quote = issuedQuotes.get(quoteId);
  if (!quote || quote.cityId !== cityId) return null;
  const target = CITIES.find((c) => c.id === cityId);
  return target ? { quote, city: target } : null;
}
