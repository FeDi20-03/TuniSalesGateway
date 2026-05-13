import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { OrdersPendingComponent } from './orders-pending.component';
import { OrderService } from 'app/entities/BusinessService/order/service/order.service';
import { AlertService } from 'app/core/util/alert.service';
import { SharedModule } from 'app/shared/shared.module';
import { ApplicationConfigService } from 'app/core/config/application-config.service';

describe('OrdersPendingComponent', () => {
  let component: OrdersPendingComponent;
  let fixture: ComponentFixture<OrdersPendingComponent>;
  let mockOrderService: jest.Mocked<OrderService>;

  beforeEach(async () => {
    mockOrderService = {
      query: jest.fn().mockReturnValue(of(new HttpResponse({ body: [] }))),
    } as any;

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, SharedModule, ReactiveFormsModule],
      declarations: [OrdersPendingComponent],
      providers: [
        { provide: OrderService, useValue: mockOrderService },
        { provide: NgbModal, useValue: { open: jest.fn() } },
        AlertService,
        ApplicationConfigService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OrdersPendingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load submitted orders', () => {
    expect(mockOrderService.query).toHaveBeenCalledWith(expect.objectContaining({ status: 'SUBMITTED' }));
    expect(component.orders).toEqual([]);
  });

  it('should set actionType to negotiate when opening negotiate modal', () => {
    const order = { id: 1, orderNumber: 'ORD-001' } as any;
    component.openNegotiateModal(order, null);
    expect(component.actionType).toBe('negotiate');
    expect(component.selectedOrder).toBe(order);
  });

  it('should set actionType to reject when opening reject modal', () => {
    const order = { id: 1, orderNumber: 'ORD-001' } as any;
    component.openRejectModal(order, null);
    expect(component.actionType).toBe('reject');
  });
});
