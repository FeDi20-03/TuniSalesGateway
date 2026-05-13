export interface IZone {
  id: number;
  name?: string | null;
  description?: string | null;
  tenantId?: number | null;
}

export type NewZone = Omit<IZone, 'id'> & { id: null };

export interface IClientAssignment {
  clientId: number;
  clientName?: string | null;
  commercialLogin?: string | null;
  zoneId?: number | null;
}
