import dayjs from 'dayjs/esm';

import { IOrderLine, NewOrderLine } from './order-line.model';

export const sampleWithRequiredData: IOrderLine = {
  id: 13942,
  quantity: 29560,
  unitPrice: 49479,
  lineTotal: 22866,
  createdAt: dayjs('2026-03-03T18:52'),
};

export const sampleWithPartialData: IOrderLine = {
  id: 45770,
  quantity: 61734,
  unitPrice: 35474,
  discountPct: 7,
  lineTotal: 27272,
  createdAt: dayjs('2026-03-03T15:12'),
};

export const sampleWithFullData: IOrderLine = {
  id: 98011,
  quantity: 53969,
  unitPrice: 15396,
  discountPct: 2,
  lineTotal: 31874,
  createdAt: dayjs('2026-03-04T09:09'),
};

export const sampleWithNewData: NewOrderLine = {
  quantity: 75239,
  unitPrice: 6952,
  lineTotal: 91180,
  createdAt: dayjs('2026-03-04T06:55'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
