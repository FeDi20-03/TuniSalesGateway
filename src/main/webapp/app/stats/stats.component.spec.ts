import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';

import { StatsComponent } from './stats.component';
import { AccountService } from 'app/core/auth/account.service';
import { AlertService } from 'app/core/util/alert.service';
import { SharedModule } from 'app/shared/shared.module';
import { ApplicationConfigService } from 'app/core/config/application-config.service';

describe('StatsComponent', () => {
  let component: StatsComponent;
  let fixture: ComponentFixture<StatsComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, SharedModule, FormsModule],
      declarations: [StatsComponent],
      providers: [ApplicationConfigService, AccountService, AlertService],
    }).compileComponents();

    fixture = TestBed.createComponent(StatsComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should create', () => {
    fixture.detectChanges();
    httpMock.match(() => true).forEach(r => r.flush([]));
    expect(component).toBeTruthy();
  });

  it('should build grade pie from scores', () => {
    const scores = [
      { grade: 'A', score: 90 },
      { grade: 'A', score: 85 },
      { grade: 'B', score: 60 },
      { grade: 'C', score: 30 },
    ];
    component.buildGradePie(scores);
    expect(component.gradeChartData.datasets[0].data).toEqual([2, 1, 1]);
  });

  it('should build performance chart', () => {
    const scores = [
      { commercialLogin: 'alice', score: 80 },
      { commercialLogin: 'bob', score: 70 },
    ];
    component.buildPerformanceChart(scores);
    expect(component.performanceChartData.labels).toEqual(['alice', 'bob']);
    expect(component.performanceChartData.datasets[0].data).toEqual([80, 70]);
  });
});
