import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';
import { HttpResponse } from '@angular/common/http';

import { PlanVenteComponent } from './plan-vente.component';
import { PlanVenteService } from './plan-vente.service';
import { SharedModule } from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

describe('PlanVenteComponent', () => {
  let component: PlanVenteComponent;
  let fixture: ComponentFixture<PlanVenteComponent>;
  let mockService: jest.Mocked<PlanVenteService>;

  beforeEach(async () => {
    mockService = {
      query: jest.fn().mockReturnValue(of(new HttpResponse({ body: [] }))),
      getCommercials: jest.fn().mockReturnValue(of([])),
      create: jest.fn(),
      delete: jest.fn(),
    } as any;

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, SharedModule, FormsModule, ReactiveFormsModule],
      declarations: [PlanVenteComponent],
      providers: [
        { provide: PlanVenteService, useValue: mockService },
        { provide: NgbModal, useValue: { open: jest.fn() } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PlanVenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should filter missions by commercial', () => {
    component.missions = [
      { id: 1, assignedToLogin: 'user1', missionType: 'VISITE', status: 'PLANNED' } as any,
      { id: 2, assignedToLogin: 'user2', missionType: 'LIVRAISON', status: 'DONE' } as any,
    ];
    component.filterCommercial = 'user1';
    expect(component.filteredMissions.length).toBe(1);
    expect(component.filteredMissions[0].assignedToLogin).toBe('user1');
  });

  it('should filter missions by type', () => {
    component.missions = [
      { id: 1, assignedToLogin: 'user1', missionType: 'VISITE', status: 'PLANNED' } as any,
      { id: 2, assignedToLogin: 'user2', missionType: 'LIVRAISON', status: 'DONE' } as any,
    ];
    component.filterType = 'LIVRAISON';
    expect(component.filteredMissions.length).toBe(1);
    expect(component.filteredMissions[0].missionType).toBe('LIVRAISON');
  });

  it('should build week days', () => {
    expect(component.weekDays.length).toBe(7);
  });
});
