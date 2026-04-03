import dayjs from 'dayjs/esm';

import { OrderStatus } from 'app/entities/enumerations/order-status.model';

import { IOrder, NewOrder } from './order.model';

export const sampleWithRequiredData: IOrder = {
  id: 47761,
  tenantId: 34511,
  orderNumber: "Pérou l'Odéon Handcrafted",
  status: OrderStatus['DELIVERED'],
  subtotal: 3810,
  totalAmount: 82425,
  isDeleted: false,
  createdAt: dayjs('2026-03-03T10:51'),
};

export const sampleWithPartialData: IOrder = {
  id: 12831,
  tenantId: 73312,
  orderNumber: 'markets',
  status: OrderStatus['UNDER_REVIEW'],
  subtotal: 32103,
  taxAmount: 92419,
  totalAmount: 69008,
  paymentTermsDays: 56118,
  dueDate: dayjs('2026-03-04T03:08'),
  submittedAt: dayjs('2026-03-03T13:57'),
  isDeleted: false,
  createdAt: dayjs('2026-03-03T11:59'),
  updatedAt: dayjs('2026-03-04T03:49'),
};

export const sampleWithFullData: IOrder = {
  id: 28008,
  tenantId: 1233,
  orderNumber: 'b Multi-layered secured',
  status: OrderStatus['SUBMITTED'],
  subtotal: 89220,
  discountAmount: 19115,
  taxAmount: 56450,
  totalAmount: 47891,
  paymentTermsDays: 95637,
  dueDate: dayjs('2026-03-03T14:07'),
  rejectionReason: 'Wooden',
  submittedAt: dayjs('2026-03-04T01:26'),
  validatedAt: dayjs('2026-03-04T09:04'),
  isDeleted: true,
  createdAt: dayjs('2026-03-03T11:29'),
  updatedAt: dayjs('2026-03-04T01:04'),
};

export const sampleWithNewData: NewOrder = {
  tenantId: 7924,
  orderNumber: 'Savings',
  status: OrderStatus['SHIPPED'],
  subtotal: 13164,
  totalAmount: 14451,
  isDeleted: true,
  createdAt: dayjs('2026-03-04T00:58'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
