import dayjs from 'dayjs/esm';

export type CreditNoteStatus = 'DRAFT' | 'VALIDATED' | 'APPLIED' | 'CANCELLED';

export interface ICreditNote {
  id: number;
  clientId?: number | null;
  clientName?: string | null;
  amount?: number | null;
  reason?: string | null;
  status?: CreditNoteStatus | null;
  createdAt?: dayjs.Dayjs | null;
  tenantId?: number | null;
}

export type NewCreditNote = Omit<ICreditNote, 'id'> & { id: null };
