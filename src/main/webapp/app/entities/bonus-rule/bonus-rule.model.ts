import dayjs from 'dayjs/esm';

export interface IBonusRule {
  id: number;
  productId?: number | null;
  productName?: string | null;
  zoneId?: number | null;
  zoneName?: string | null;
  periodStart?: dayjs.Dayjs | null;
  periodEnd?: dayjs.Dayjs | null;
  amount?: number | null;
  description?: string | null;
  tenantId?: number | null;
}

export type NewBonusRule = Omit<IBonusRule, 'id'> & { id: null };
