import dayjs from 'dayjs/esm';

import { InvoiceStatus } from 'app/entities/enumerations/invoice-status.model';

import { IInvoice, NewInvoice } from './invoice.model';

export const sampleWithRequiredData: IInvoice = {
  id: 91509,
  tenantId: 62071,
  invoiceNumber: 'Rustic content',
  amountHt: 48480,
  taxAmount: 49437,
  amountTtc: 45303,
  status: InvoiceStatus['DRAFT'],
  issueDate: dayjs('2026-03-03T20:30'),
  dueDate: dayjs('2026-03-04T02:02'),
  isDeleted: true,
  createdAt: dayjs('2026-03-03T16:54'),
};

export const sampleWithPartialData: IInvoice = {
  id: 89149,
  tenantId: 58319,
  invoiceNumber: 'users',
  amountHt: 35028,
  taxAmount: 55119,
  amountTtc: 89329,
  status: InvoiceStatus['PARTIALLY_PAID'],
  issueDate: dayjs('2026-03-04T02:52'),
  dueDate: dayjs('2026-03-03T11:07'),
  paidAt: dayjs('2026-03-03T21:33'),
  isDeleted: true,
  createdAt: dayjs('2026-03-04T02:25'),
  updatedAt: dayjs('2026-03-03T20:22'),
};

export const sampleWithFullData: IInvoice = {
  id: 17005,
  tenantId: 69991,
  invoiceNumber: 'Rubber',
  amountHt: 75162,
  taxAmount: 35861,
  amountTtc: 91014,
  status: InvoiceStatus['CANCELLED'],
  issueDate: dayjs('2026-03-03T14:02'),
  dueDate: dayjs('2026-03-03T11:18'),
  paidAt: dayjs('2026-03-04T07:26'),
  isDeleted: false,
  createdAt: dayjs('2026-03-04T07:05'),
  updatedAt: dayjs('2026-03-03T21:44'),
};

export const sampleWithNewData: NewInvoice = {
  tenantId: 39937,
  invoiceNumber: 'Cheese Bedfordshire online',
  amountHt: 73083,
  taxAmount: 76587,
  amountTtc: 49039,
  status: InvoiceStatus['PAID'],
  issueDate: dayjs('2026-03-03T14:09'),
  dueDate: dayjs('2026-03-04T03:14'),
  isDeleted: true,
  createdAt: dayjs('2026-03-03T19:38'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
