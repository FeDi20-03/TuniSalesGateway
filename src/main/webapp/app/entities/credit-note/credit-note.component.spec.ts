import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { HttpResponse } from '@angular/common/http';

import { CreditNoteComponent } from './credit-note.component';
import { CreditNoteService } from './credit-note.service';
import { AccountService } from 'app/core/auth/account.service';
import { AlertService } from 'app/core/util/alert.service';
import { SharedModule } from 'app/shared/shared.module';

describe('CreditNoteComponent', () => {
  let component: CreditNoteComponent;
  let fixture: ComponentFixture<CreditNoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, SharedModule, ReactiveFormsModule],
      declarations: [CreditNoteComponent],
      providers: [
        { provide: CreditNoteService, useValue: { query: () => of(new HttpResponse({ body: [] })) } },
        { provide: AccountService, useValue: { hasAnyAuthority: () => true } },
        { provide: NgbModal, useValue: { open: jest.fn() } },
        AlertService,
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(CreditNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => expect(component).toBeTruthy());
  it('isAdminCommercial should be true when hasAnyAuthority returns true', () => expect(component.isAdminCommercial).toBe(true));
});
