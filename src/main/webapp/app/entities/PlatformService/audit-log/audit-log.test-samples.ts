import dayjs from 'dayjs/esm';

import { AuditAction } from 'app/entities/enumerations/audit-action.model';

import { IAuditLog, NewAuditLog } from './audit-log.model';

export const sampleWithRequiredData: IAuditLog = {
  id: 26873,
  entityType: 'deposit Coordinateur Tilsitt',
  action: AuditAction['EXPORT'],
  createdAt: dayjs('2026-03-03T17:00'),
};

export const sampleWithPartialData: IAuditLog = {
  id: 65717,
  entityType: 'Franche-Comté',
  action: AuditAction['REJECT'],
  beforeJson: '../fake-data/blob/hipster.txt',
  afterJson: '../fake-data/blob/hipster.txt',
  userAgent: 'Bolivar Intelligent',
  createdAt: dayjs('2026-03-03T11:04'),
};

export const sampleWithFullData: IAuditLog = {
  id: 50624,
  tenantId: 75558,
  entityType: 'Phased grow',
  entityId: 'redundant Movies system',
  action: AuditAction['UPDATE'],
  beforeJson: '../fake-data/blob/hipster.txt',
  afterJson: '../fake-data/blob/hipster.txt',
  ipAddress: 'Vaneau Chine quantifying',
  userAgent: 'foreground',
  performedByLogin: 'Directeur',
  createdAt: dayjs('2026-03-03T12:07'),
};

export const sampleWithNewData: NewAuditLog = {
  entityType: 'Ameliorated',
  action: AuditAction['DELETE'],
  createdAt: dayjs('2026-03-03T17:04'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
