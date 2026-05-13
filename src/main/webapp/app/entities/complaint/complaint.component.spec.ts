import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { HttpResponse } from '@angular/common/http';

import { ComplaintComponent } from './complaint.component';
import { ComplaintService } from './complaint.service';
import { AccountService } from 'app/core/auth/account.service';
import { AlertService } from 'app/core/util/alert.service';
import { SharedModule } from 'app/shared/shared.module';

describe('ComplaintComponent', () => {
  let component: ComplaintComponent;
  let fixture: ComponentFixture<ComplaintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, SharedModule, ReactiveFormsModule],
      declarations: [ComplaintComponent],
      providers: [
        { provide: ComplaintService, useValue: { query: () => of(new HttpResponse({ body: [] })) } },
        { provide: AccountService, useValue: { hasAnyAuthority: () => false } },
        { provide: NgbModal, useValue: { open: jest.fn() } },
        AlertService,
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(ComplaintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => expect(component).toBeTruthy());
  it('isAdmin should be false for non-admin', () => expect(component.isAdmin).toBe(false));
  it('should have complaint types', () => expect(component.complaintTypes.length).toBeGreaterThan(0));
});
