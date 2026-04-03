import dayjs from 'dayjs/esm';

import { TenantStatus } from 'app/entities/enumerations/tenant-status.model';

import { ITenant, NewTenant } from './tenant.model';

export const sampleWithRequiredData: ITenant = {
  id: 41639,
  name: 'Right-sized',
  code: 'parsing',
  status: TenantStatus['INACTIVE'],
  createdAt: dayjs('2026-03-03T10:28'),
};

export const sampleWithPartialData: ITenant = {
  id: 55705,
  name: 'Gloves',
  code: 'Joubert (EURCO)',
  status: TenantStatus['TRIAL'],
  createdAt: dayjs('2026-03-04T02:16'),
};

export const sampleWithFullData: ITenant = {
  id: 9972,
  name: 'generate',
  code: 'leading-edge productize',
  status: TenantStatus['ACTIVE'],
  createdAt: dayjs('2026-03-04T07:28'),
  updatedAt: dayjs('2026-03-03T19:33'),
};

export const sampleWithNewData: NewTenant = {
  name: 'navigate',
  code: 'Belgique instruction',
  status: TenantStatus['TRIAL'],
  createdAt: dayjs('2026-03-03T13:02'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
