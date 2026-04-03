import dayjs from 'dayjs/esm';

import { DeliveryStatus } from 'app/entities/enumerations/delivery-status.model';

import { IDelivery, NewDelivery } from './delivery.model';

export const sampleWithRequiredData: IDelivery = {
  id: 76194,
  tenantId: 30398,
  deliveryNumber: 'Soft Cambridgeshire Provence-Alpes-Côte',
  status: DeliveryStatus['PENDING'],
  createdAt: dayjs('2026-03-04T00:23'),
};

export const sampleWithPartialData: IDelivery = {
  id: 35202,
  tenantId: 88358,
  deliveryNumber: 'Manager Tuna',
  status: DeliveryStatus['IN_PREPARATION'],
  trackingNumber: 'b integrated Gibraltar',
  deliveredAt: dayjs('2026-03-03T16:59'),
  confirmedAt: dayjs('2026-03-03T18:58'),
  notes: 'Soap repurpose',
  createdAt: dayjs('2026-03-04T06:18'),
};

export const sampleWithFullData: IDelivery = {
  id: 49566,
  tenantId: 18090,
  deliveryNumber: 'Kwanza matrix Norwegian',
  status: DeliveryStatus['SHIPPED'],
  trackingNumber: 'leverage array flexibility',
  shippedAt: dayjs('2026-03-04T06:29'),
  deliveredAt: dayjs('2026-03-03T19:53'),
  confirmedAt: dayjs('2026-03-03T20:16'),
  notes: 'clear-thinking',
  createdAt: dayjs('2026-03-03T21:30'),
};

export const sampleWithNewData: NewDelivery = {
  tenantId: 83358,
  deliveryNumber: 'syndicate calculating',
  status: DeliveryStatus['PENDING'],
  createdAt: dayjs('2026-03-03T13:08'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
