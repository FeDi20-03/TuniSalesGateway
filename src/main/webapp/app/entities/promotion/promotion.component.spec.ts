import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { HttpResponse } from '@angular/common/http';

import { PromotionComponent } from './promotion.component';
import { PromotionService } from './promotion.service';
import { SharedModule } from 'app/shared/shared.module';

describe('PromotionComponent', () => {
  let component: PromotionComponent;
  let fixture: ComponentFixture<PromotionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, SharedModule, ReactiveFormsModule],
      declarations: [PromotionComponent],
      providers: [
        {
          provide: PromotionService,
          useValue: { query: () => of(new HttpResponse({ body: [] })), delete: () => of(new HttpResponse({})) },
        },
        { provide: NgbModal, useValue: { open: jest.fn() } },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(PromotionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => expect(component).toBeTruthy());
});
