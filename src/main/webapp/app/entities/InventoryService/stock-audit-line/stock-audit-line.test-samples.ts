import dayjs from 'dayjs/esm';

import { AuditResolution } from 'app/entities/enumerations/audit-resolution.model';

import { IStockAuditLine, NewStockAuditLine } from './stock-audit-line.model';

export const sampleWithRequiredData: IStockAuditLine = {
  id: 8965,
  foundPhysically: false,
  createdAt: dayjs('2026-03-04T01:48'),
};

export const sampleWithPartialData: IStockAuditLine = {
  id: 28568,
  foundPhysically: false,
  resolution: AuditResolution['SYSTEM_ERROR'],
  createdAt: dayjs('2026-03-04T02:59'),
};

export const sampleWithFullData: IStockAuditLine = {
  id: 8371,
  foundPhysically: true,
  resolution: AuditResolution['LOST_STOLEN'],
  resolutionNote: 'Yen Suriname ADP',
  createdAt: dayjs('2026-03-03T12:58'),
};

export const sampleWithNewData: NewStockAuditLine = {
  foundPhysically: true,
  createdAt: dayjs('2026-03-03T16:54'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
