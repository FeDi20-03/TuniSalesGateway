import dayjs from 'dayjs/esm';

import { ScoreClassification } from 'app/entities/enumerations/score-classification.model';

import { IPerformanceScore, NewPerformanceScore } from './performance-score.model';

export const sampleWithRequiredData: IPerformanceScore = {
  id: 15817,
  tenantId: 45138,
  userLogin: 'Oberkampf',
  period: 'aggrega',
  score: 18,
  classification: ScoreClassification['EXCELLENT'],
  calculatedAt: dayjs('2026-03-03T21:19'),
};

export const sampleWithPartialData: IPerformanceScore = {
  id: 66009,
  tenantId: 17117,
  userLogin: 'generating Saint-Jacques ADP',
  period: 'monitor',
  score: 74,
  classification: ScoreClassification['EXCELLENT'],
  breakdownJson: '../fake-data/blob/hipster.txt',
  deltaVsPrevious: 17717,
  calculatedAt: dayjs('2026-03-04T06:03'),
};

export const sampleWithFullData: IPerformanceScore = {
  id: 91522,
  tenantId: 30716,
  userLogin: 'c a',
  period: 'input A',
  score: 47,
  classification: ScoreClassification['AVERAGE'],
  breakdownJson: '../fake-data/blob/hipster.txt',
  deltaVsPrevious: 42389,
  calculatedAt: dayjs('2026-03-03T12:33'),
};

export const sampleWithNewData: NewPerformanceScore = {
  tenantId: 68089,
  userLogin: 'Plastic Architecte',
  period: 'Unbrand',
  score: 17,
  classification: ScoreClassification['AVERAGE'],
  calculatedAt: dayjs('2026-03-03T20:20'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
