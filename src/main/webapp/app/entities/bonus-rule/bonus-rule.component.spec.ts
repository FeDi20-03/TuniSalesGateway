import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { HttpResponse } from '@angular/common/http';

import { BonusRuleComponent } from './bonus-rule.component';
import { BonusRuleService } from './bonus-rule.service';
import { SharedModule } from 'app/shared/shared.module';
import { ApplicationConfigService } from 'app/core/config/application-config.service';

describe('BonusRuleComponent', () => {
  let component: BonusRuleComponent;
  let fixture: ComponentFixture<BonusRuleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, SharedModule, ReactiveFormsModule],
      declarations: [BonusRuleComponent],
      providers: [
        {
          provide: BonusRuleService,
          useValue: { query: () => of(new HttpResponse({ body: [] })), delete: () => of(new HttpResponse({})) },
        },
        { provide: NgbModal, useValue: { open: jest.fn() } },
        ApplicationConfigService,
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(BonusRuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => expect(component).toBeTruthy());
});
