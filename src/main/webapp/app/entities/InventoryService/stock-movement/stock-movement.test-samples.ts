import dayjs from 'dayjs/esm';

import { MovementType } from 'app/entities/enumerations/movement-type.model';

import { IStockMovement, NewStockMovement } from './stock-movement.model';

export const sampleWithRequiredData: IStockMovement = {
  id: 44614,
  movementType: MovementType['INBOUND'],
  quantity: 71062,
  createdAt: dayjs('2026-03-03T16:33'),
};

export const sampleWithPartialData: IStockMovement = {
  id: 24181,
  movementType: MovementType['OUTBOUND'],
  quantity: 21714,
  createdAt: dayjs('2026-03-04T07:11'),
};

export const sampleWithFullData: IStockMovement = {
  id: 86281,
  movementType: MovementType['RETURN'],
  reason: 'ivory deposit',
  reference: 'invoice Re-contextualized',
  quantity: 73960,
  performedByLogin: 'Generic systematic',
  createdAt: dayjs('2026-03-03T23:08'),
};

export const sampleWithNewData: NewStockMovement = {
  movementType: MovementType['SWAP_OUT'],
  quantity: 97470,
  createdAt: dayjs('2026-03-03T21:06'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
