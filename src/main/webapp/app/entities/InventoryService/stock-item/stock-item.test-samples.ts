import dayjs from 'dayjs/esm';

import { StockItemStatus } from 'app/entities/enumerations/stock-item-status.model';

import { IStockItem, NewStockItem } from './stock-item.model';

export const sampleWithRequiredData: IStockItem = {
  id: 89819,
  tenantId: 9840,
  productId: 52729,
  imei: 'RubberXXXXXXXXX',
  status: StockItemStatus['IN_TRANSIT'],
  isDeleted: true,
  acquiredAt: dayjs('2026-03-03T11:14'),
};

export const sampleWithPartialData: IStockItem = {
  id: 55284,
  tenantId: 14367,
  productId: 76072,
  productName: 'Mali',
  imei: 'navigating Lice',
  status: StockItemStatus['ALLOCATED'],
  isDeleted: false,
  acquiredAt: dayjs('2026-03-03T21:55'),
};

export const sampleWithFullData: IStockItem = {
  id: 78855,
  tenantId: 28250,
  productId: 43047,
  productName: 'b Fantastic de',
  imei: 'Dollar AutoXXXX',
  status: StockItemStatus['DEPLOYED'],
  isDeleted: false,
  acquiredAt: dayjs('2026-03-04T02:06'),
  updatedAt: dayjs('2026-03-03T13:54'),
};

export const sampleWithNewData: NewStockItem = {
  tenantId: 47021,
  productId: 8013,
  imei: 'database blueto',
  status: StockItemStatus['IN_TRANSIT'],
  isDeleted: true,
  acquiredAt: dayjs('2026-03-03T21:27'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
