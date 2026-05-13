export interface ISalesOverview {
  period?: string;
  totalSales?: number;
  validatedOrdersCount?: number;
  topCommercials?: { login: string; total: number }[];
  topProducts?: { name: string; quantity: number }[];
  salesByZone?: { zone: string; total: number }[];
  dailyEvolution?: { date: string; total: number }[];
}
