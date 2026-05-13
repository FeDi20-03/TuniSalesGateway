import dayjs from 'dayjs/esm';

export type ComplaintType = 'PRODUIT_DEFECTUEUX' | 'LIVRAISON' | 'FACTURATION' | 'SERVICE' | 'AUTRE';
export type ComplaintStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';

export interface IComplaint {
  id: number;
  type?: ComplaintType | null;
  description?: string | null;
  imei?: string | null;
  status?: ComplaintStatus | null;
  resolution?: string | null;
  clientLogin?: string | null;
  createdAt?: dayjs.Dayjs | null;
  resolvedAt?: dayjs.Dayjs | null;
  tenantId?: number | null;
}

export type NewComplaint = Omit<IComplaint, 'id'> & { id: null };
