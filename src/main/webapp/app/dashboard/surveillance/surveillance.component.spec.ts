import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';

import { SurveillanceComponent } from './surveillance.component';
import { NotificationsWebSocketService } from 'app/core/websocket/notifications-websocket.service';
import { SharedModule } from 'app/shared/shared.module';
import { ApplicationConfigService } from 'app/core/config/application-config.service';

describe('SurveillanceComponent', () => {
  let component: SurveillanceComponent;
  let fixture: ComponentFixture<SurveillanceComponent>;
  let httpMock: HttpTestingController;
  const notifSubject = new Subject<any>();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, SharedModule, FormsModule],
      declarations: [SurveillanceComponent],
      providers: [
        ApplicationConfigService,
        {
          provide: NotificationsWebSocketService,
          useValue: { notifications$: notifSubject.asObservable() },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SurveillanceComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should create', () => {
    fixture.detectChanges();
    const req = httpMock.expectOne(r => r.url.includes('sales-overview'));
    req.flush({});
    expect(component).toBeTruthy();
  });

  it('should build bar chart data from overview', () => {
    const mockOverview = {
      totalSales: 10000,
      validatedOrdersCount: 5,
      salesByZone: [
        { zone: 'Nord', total: 5000 },
        { zone: 'Sud', total: 5000 },
      ],
      dailyEvolution: [{ date: '2026-05-01', total: 1000 }],
    };
    fixture.detectChanges();
    const req = httpMock.expectOne(r => r.url.includes('sales-overview'));
    req.flush(mockOverview);
    expect(component.barChartData.labels).toEqual(['Nord', 'Sud']);
    expect(component.lineChartData.labels).toEqual(['2026-05-01']);
  });
});
