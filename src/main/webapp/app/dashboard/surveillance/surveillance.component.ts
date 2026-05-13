import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { ISalesOverview } from './surveillance.model';
import { NotificationsWebSocketService } from 'app/core/websocket/notifications-websocket.service';

@Component({
  selector: 'jhi-surveillance',
  templateUrl: './surveillance.component.html',
})
export class SurveillanceComponent implements OnInit, OnDestroy {
  overview: ISalesOverview | null = null;
  isLoading = false;

  // Filtres
  filterPeriod = new Date().toISOString().slice(0, 7); // YYYY-MM
  filterZone = '';
  filterCommercial = '';

  // Chart.js data
  barChartData: any = { labels: [], datasets: [] };
  lineChartData: any = { labels: [], datasets: [] };
  barChartOptions = { responsive: true, plugins: { legend: { position: 'top' } } };

  private wsSubscription?: Subscription;
  private resourceUrl: string;

  constructor(
    private http: HttpClient,
    private applicationConfigService: ApplicationConfigService,
    private wsService: NotificationsWebSocketService
  ) {
    this.resourceUrl = this.applicationConfigService.getEndpointFor('api/audit-logs/sales-overview', 'platformservice');
  }

  ngOnInit(): void {
    this.load();

    // Rafraîchissement WebSocket sur ORDER_VALIDATED
    this.wsSubscription = this.wsService.notifications$.subscribe(notif => {
      if (notif?.type === 'ORDER_VALIDATED') {
        this.load();
      }
    });
  }

  ngOnDestroy(): void {
    this.wsSubscription?.unsubscribe();
  }

  load(): void {
    this.isLoading = true;
    const params: any = { period: this.filterPeriod };
    if (this.filterZone) params['zone'] = this.filterZone;
    if (this.filterCommercial) params['commercial'] = this.filterCommercial;

    this.http.get<ISalesOverview>(this.resourceUrl, { params }).subscribe({
      next: data => {
        this.overview = data;
        this.buildCharts(data);
        this.isLoading = false;
      },
      error: () => (this.isLoading = false),
    });
  }

  buildCharts(data: ISalesOverview): void {
    // Bar chart: ventes par zone
    if (data.salesByZone?.length) {
      this.barChartData = {
        labels: data.salesByZone.map(z => z.zone),
        datasets: [
          {
            data: data.salesByZone.map(z => z.total),
            label: 'Ventes par zone',
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
          },
        ],
      };
    }

    // Line chart: évolution journalière
    if (data.dailyEvolution?.length) {
      this.lineChartData = {
        labels: data.dailyEvolution.map(d => d.date),
        datasets: [
          {
            data: data.dailyEvolution.map(d => d.total),
            label: 'Évolution journalière',
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            fill: true,
            tension: 0.3,
          },
        ],
      };
    }
  }
}
