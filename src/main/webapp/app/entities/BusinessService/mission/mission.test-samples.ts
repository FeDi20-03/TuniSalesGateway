import dayjs from 'dayjs/esm';

import { MissionStatus } from 'app/entities/enumerations/mission-status.model';

import { IMission, NewMission } from './mission.model';

export const sampleWithRequiredData: IMission = {
  id: 13680,
  tenantId: 51134,
  assignedToLogin: 'Sleek payment Developpeur',
  title: 'scale Awesome cultivate',
  missionDate: dayjs('2026-03-04T00:18'),
  status: MissionStatus['IN_PROGRESS'],
  createdAt: dayjs('2026-03-03T17:00'),
};

export const sampleWithPartialData: IMission = {
  id: 14141,
  tenantId: 7125,
  assignedToLogin: 'functionalities markets visualize',
  title: 'compressing Kirghizistan SSL',
  missionDate: dayjs('2026-03-03T13:32'),
  status: MissionStatus['COMPLETED'],
  createdAt: dayjs('2026-03-03T22:03'),
};

export const sampleWithFullData: IMission = {
  id: 9316,
  tenantId: 85578,
  assignedToLogin: 'e-business',
  title: 'Hat Awesome Peso',
  description: 'lime Granite Intelligent',
  missionDate: dayjs('2026-03-03T11:00'),
  status: MissionStatus['IN_PROGRESS'],
  createdAt: dayjs('2026-03-04T03:41'),
  updatedAt: dayjs('2026-03-03T15:09'),
};

export const sampleWithNewData: NewMission = {
  tenantId: 79562,
  assignedToLogin: 'Fresh',
  title: 'Granite',
  missionDate: dayjs('2026-03-04T04:52'),
  status: MissionStatus['IN_PROGRESS'],
  createdAt: dayjs('2026-03-04T07:04'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
