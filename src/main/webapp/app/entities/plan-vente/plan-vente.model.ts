import dayjs from 'dayjs/esm';

export type MissionType = 'VISITE' | 'LIVRAISON' | 'RECOUVREMENT' | 'PROSPECTION' | 'AUTRE';
export type MissionStatus = 'PLANNED' | 'IN_PROGRESS' | 'DONE' | 'CANCELLED';

export interface IPlanVenteMission {
  id: number;
  tenantId?: number | null;
  assignedToLogin?: string | null;
  title?: string | null;
  description?: string | null;
  missionDate?: dayjs.Dayjs | null;
  missionType?: MissionType | null;
  status?: MissionStatus | null;
  createdAt?: dayjs.Dayjs | null;
  updatedAt?: dayjs.Dayjs | null;
}

export type NewPlanVenteMission = Omit<IPlanVenteMission, 'id'> & { id: null };
