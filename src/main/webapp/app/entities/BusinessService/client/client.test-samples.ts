import dayjs from 'dayjs/esm';

import { ClientType } from 'app/entities/enumerations/client-type.model';
import { ClientStatus } from 'app/entities/enumerations/client-status.model';

import { IClient, NewClient } from './client.model';

export const sampleWithRequiredData: IClient = {
  id: 71655,
  tenantId: 33198,
  name: 'Cotton primary Poitou-Charentes',
  clientType: ClientType['NATIONAL_DISTRIBUTOR'],
  status: ClientStatus['ACTIVE'],
  isDeleted: true,
  createdAt: dayjs('2026-03-03T11:27'),
};

export const sampleWithPartialData: IClient = {
  id: 90261,
  tenantId: 26444,
  name: 'Gorgeous Devolved',
  clientType: ClientType['INDEPENDENT_POS'],
  creditUsed: 92213,
  paymentTermsDays: 89820,
  status: ClientStatus['CHURN_RISK'],
  lastOrderAt: dayjs('2026-03-03T16:28'),
  isDeleted: false,
  createdAt: dayjs('2026-03-04T09:34'),
  updatedAt: dayjs('2026-03-04T04:21'),
};

export const sampleWithFullData: IClient = {
  id: 75745,
  tenantId: 77323,
  name: 'Steel',
  taxId: 'reinvent PNG seamless',
  clientType: ClientType['REGIONAL_WHOLESALER'],
  creditLimit: 16446,
  creditUsed: 8145,
  paymentTermsDays: 70359,
  status: ClientStatus['CHURN_RISK'],
  lastOrderAt: dayjs('2026-03-04T09:37'),
  isDeleted: true,
  createdAt: dayjs('2026-03-03T23:02'),
  updatedAt: dayjs('2026-03-04T05:36'),
};

export const sampleWithNewData: NewClient = {
  tenantId: 38965,
  name: 'Soft',
  clientType: ClientType['INDEPENDENT_POS'],
  status: ClientStatus['INACTIVE'],
  isDeleted: false,
  createdAt: dayjs('2026-03-04T02:41'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
