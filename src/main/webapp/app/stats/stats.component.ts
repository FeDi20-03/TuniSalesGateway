import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { AccountService } from 'app/core/auth/account.service';
import { AlertService } from 'app/core/util/alert.service';

@Component({
  selector: 'jhi-stats',
  templateUrl: './stats.component.html',
})
export class StatsComponent implements OnInit {
  activeTab = 'sales';
  isLoading = false;
  isRecomputing = false;
  isAdmin = false;

  filterPeriod = new Date().toISOString().slice(0, 7);

  // Data
  salesOverview: any = null;
  clientScores: any[] = [];
  performanceScores: any[] = [];

  // Charts
  salesHeatmapData: { model: string; zone: string; count: number }[] = [];
  performanceChartData: any = { labels: [], datasets: [] };
  gradeChartData: any = { labels: ['A', 'B', 'C'], datasets: [{ data: [0, 0, 0], backgroundColor: ['#28a745', '#ffc107', '#dc3545'] }] };

  private salesOverviewUrl: string;
  private clientScoresUrl: string;
  private performanceScoresUrl: string;

  constructor(
    private http: HttpClient,
    private applicationConfigService: ApplicationConfigService,
    private accountService: AccountService,
    private alertService: AlertService
  ) {
    this.salesOverviewUrl = this.applicationConfigService.getEndpointFor('api/audit-logs/sales-overview', 'platformservice');
    this.clientScoresUrl = this.applicationConfigService.getEndpointFor('api/client-scores', 'platformservice');
    this.performanceScoresUrl = this.applicationConfigService.getEndpointFor('api/performance-scores', 'platformservice');
  }

  ngOnInit(): void {
    this.isAdmin = this.accountService.hasAnyAuthority(['ROLE_ADMIN_COMMERCIAL', 'ROLE_ADMIN']);
    this.loadAll();
  }

  loadAll(): void {
    this.isLoading = true;
    const params = { period: this.filterPeriod };

    this.http.get<any>(this.salesOverviewUrl, { params }).subscribe({
      next: data => {
        this.salesOverview = data;
        this.buildSalesHeatmap(data);
      },
    });

    this.http.get<any[]>(this.clientScoresUrl, { params }).subscribe({
      next: scores => {
        this.clientScores = scores;
        this.buildGradePie(scores);
        this.isLoading = false;
      },
      error: () => (this.isLoading = false),
    });

    this.http.get<any[]>(this.performanceScoresUrl, { params }).subscribe({
      next: scores => {
        this.performanceScores = scores;
        this.buildPerformanceChart(scores);
      },
    });
  }

  buildSalesHeatmap(data: any): void {
    this.salesHeatmapData = data?.salesByModelAndZone ?? [];
  }

  buildGradePie(scores: any[]): void {
    const grades = { A: 0, B: 0, C: 0 };
    scores.forEach(s => {
      const g = s.grade as 'A' | 'B' | 'C';
      if (g in grades) grades[g]++;
    });
    this.gradeChartData = {
      labels: ['Grade A', 'Grade B', 'Grade C'],
      datasets: [{ data: [grades.A, grades.B, grades.C], backgroundColor: ['#28a745', '#ffc107', '#dc3545'] }],
    };
  }

  buildPerformanceChart(scores: any[]): void {
    this.performanceChartData = {
      labels: scores.map(s => s.commercialLogin ?? s.login ?? s.id),
      datasets: [
        {
          label: 'Score de performance',
          data: scores.map(s => s.score ?? 0),
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
        },
      ],
    };
  }

  recompute(type: 'client-scores' | 'performance-scores'): void {
    this.isRecomputing = true;
    const url = type === 'client-scores' ? `${this.clientScoresUrl}/recompute` : `${this.performanceScoresUrl}/recompute`;
    this.http.post(url, {}).subscribe({
      next: () => {
        this.alertService.addAlert({ type: 'success', translationKey: 'stats.recomputed' });
        this.isRecomputing = false;
        this.loadAll();
      },
      error: () => {
        this.alertService.addAlert({ type: 'danger', translationKey: 'stats.recomputeError' });
        this.isRecomputing = false;
      },
    });
  }
}
