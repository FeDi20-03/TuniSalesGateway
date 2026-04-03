import dayjs from 'dayjs/esm';

import { NotificationType } from 'app/entities/enumerations/notification-type.model';

import { INotification, NewNotification } from './notification.model';

export const sampleWithRequiredData: INotification = {
  id: 30621,
  tenantId: 1657,
  recipientLogin: 'payment',
  type: NotificationType['SCORE_CALCULATED'],
  title: 'Practical',
  isRead: true,
  createdAt: dayjs('2026-03-04T04:09'),
};

export const sampleWithPartialData: INotification = {
  id: 900,
  tenantId: 32606,
  recipientLogin: 'quantify magenta',
  type: NotificationType['ORDER_APPROVED'],
  title: 'User',
  payloadJson: '../fake-data/blob/hipster.txt',
  isRead: true,
  createdAt: dayjs('2026-03-03T20:42'),
};

export const sampleWithFullData: INotification = {
  id: 23094,
  tenantId: 50026,
  recipientLogin: 'Salad Market hacking',
  type: NotificationType['DELIVERY_CONFIRMED'],
  title: 'deposit Bedfordshire Gorgeous',
  body: 'Plastic Agent',
  payloadJson: '../fake-data/blob/hipster.txt',
  isRead: false,
  readAt: dayjs('2026-03-03T12:26'),
  createdAt: dayjs('2026-03-03T18:12'),
};

export const sampleWithNewData: NewNotification = {
  tenantId: 45899,
  recipientLogin: 'Computers',
  type: NotificationType['ORDER_REJECTED'],
  title: 'Tasty Stagiaire',
  isRead: false,
  createdAt: dayjs('2026-03-04T03:33'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
