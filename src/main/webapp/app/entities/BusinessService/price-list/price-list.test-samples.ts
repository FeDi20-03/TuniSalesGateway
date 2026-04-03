import dayjs from 'dayjs/esm';

import { IPriceList, NewPriceList } from './price-list.model';

export const sampleWithRequiredData: IPriceList = {
  id: 49490,
  unitPrice: 24290,
  validFrom: dayjs('2026-03-03T11:25'),
  validTo: dayjs('2026-03-03T14:18'),
  isActive: false,
  createdAt: dayjs('2026-03-03T20:36'),
};

export const sampleWithPartialData: IPriceList = {
  id: 25379,
  unitPrice: 35015,
  validFrom: dayjs('2026-03-03T13:43'),
  validTo: dayjs('2026-03-03T20:10'),
  isActive: true,
  createdAt: dayjs('2026-03-04T05:48'),
};

export const sampleWithFullData: IPriceList = {
  id: 54709,
  unitPrice: 39216,
  maxDiscountPct: 69,
  validFrom: dayjs('2026-03-03T15:01'),
  validTo: dayjs('2026-03-03T22:39'),
  isActive: false,
  createdAt: dayjs('2026-03-03T19:03'),
};

export const sampleWithNewData: NewPriceList = {
  unitPrice: 87122,
  validFrom: dayjs('2026-03-04T05:16'),
  validTo: dayjs('2026-03-04T07:48'),
  isActive: true,
  createdAt: dayjs('2026-03-03T19:20'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
