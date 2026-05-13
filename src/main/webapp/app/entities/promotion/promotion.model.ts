import dayjs from 'dayjs/esm';

export interface IPromotion {
  id: number;
  productId?: number | null;
  productName?: string | null;
  discountPercent?: number | null;
  startDate?: dayjs.Dayjs | null;
  endDate?: dayjs.Dayjs | null;
  conditions?: string | null;
  tenantId?: number | null;
}

export type NewPromotion = Omit<IPromotion, 'id'> & { id: null };
