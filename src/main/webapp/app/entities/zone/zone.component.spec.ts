import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';
import { HttpResponse } from '@angular/common/http';

import { ZoneComponent } from './zone.component';
import { ZoneService } from './zone.service';
import { SharedModule } from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApplicationConfigService } from 'app/core/config/application-config.service';

describe('ZoneComponent', () => {
  let component: ZoneComponent;
  let fixture: ComponentFixture<ZoneComponent>;
  let mockZoneService: jest.Mocked<ZoneService>;

  beforeEach(async () => {
    mockZoneService = {
      query: jest.fn().mockReturnValue(of(new HttpResponse({ body: [] }))),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      getClientsByCommercial: jest.fn().mockReturnValue(of([])),
      assignClientToCommercial: jest.fn(),
    } as any;

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, SharedModule, FormsModule, ReactiveFormsModule],
      declarations: [ZoneComponent],
      providers: [
        { provide: ZoneService, useValue: mockZoneService },
        { provide: NgbModal, useValue: { open: jest.fn() } },
        ApplicationConfigService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ZoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load zones on init', () => {
    expect(mockZoneService.query).toHaveBeenCalled();
    expect(component.zones).toEqual([]);
  });

  it('should call assignClientToCommercial on assignClient', () => {
    mockZoneService.assignClientToCommercial.mockReturnValue(of(null));
    mockZoneService.getClientsByCommercial.mockReturnValue(of([]));
    component.selectedCommercial = 'commercial1';
    component.assignClient(1, 'commercial1');
    expect(mockZoneService.assignClientToCommercial).toHaveBeenCalledWith(1, 'commercial1');
  });
});
