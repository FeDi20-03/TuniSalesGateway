import dayjs from 'dayjs/esm';

import { SwapStatus } from 'app/entities/enumerations/swap-status.model';

import { ISwap, NewSwap } from './swap.model';

export const sampleWithRequiredData: ISwap = {
  id: 19243,
  tenantId: 7010,
  clientId: 25162,
  status: SwapStatus['IN_PROGRESS'],
  createdAt: dayjs('2026-03-03T14:49'),
};

export const sampleWithPartialData: ISwap = {
  id: 90805,
  tenantId: 49127,
  clientId: 83891,
  status: SwapStatus['PENDING'],
  createdAt: dayjs('2026-03-03T13:46'),
  updatedAt: dayjs('2026-03-04T00:22'),
};

export const sampleWithFullData: ISwap = {
  id: 69947,
  tenantId: 44170,
  clientId: 37352,
  clientName: 'Producteur monitor transmit',
  status: SwapStatus['IN_PROGRESS'],
  reason: 'applications a withdrawal',
  createdAt: dayjs('2026-03-03T17:35'),
  resolvedAt: dayjs('2026-03-04T04:46'),
  updatedAt: dayjs('2026-03-04T07:30'),
};

export const sampleWithNewData: NewSwap = {
  tenantId: 55530,
  clientId: 34558,
  status: SwapStatus['IN_PROGRESS'],
  createdAt: dayjs('2026-03-03T22:10'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
