import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

import { OnboardingComponent } from './onboarding.component';
import { AlertService } from 'app/core/util/alert.service';
import { SharedModule } from 'app/shared/shared.module';
import { ApplicationConfigService } from 'app/core/config/application-config.service';

describe('OnboardingComponent', () => {
  let component: OnboardingComponent;
  let fixture: ComponentFixture<OnboardingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, SharedModule, ReactiveFormsModule, RouterTestingModule],
      declarations: [OnboardingComponent],
      providers: [ApplicationConfigService, AlertService],
    }).compileComponents();

    fixture = TestBed.createComponent(OnboardingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should start at step 1', () => {
    expect(component.currentStep).toBe(1);
  });

  it('should have 1 vendeur by default', () => {
    expect(component.vendeursArray.length).toBe(1);
  });

  it('should add vendeur', () => {
    component.addVendeur();
    expect(component.vendeursArray.length).toBe(2);
  });

  it('should not remove last vendeur', () => {
    component.removeVendeur(0);
    expect(component.vendeursArray.length).toBe(1);
  });

  it('should remove vendeur when more than 1', () => {
    component.addVendeur();
    component.removeVendeur(0);
    expect(component.vendeursArray.length).toBe(1);
  });
});
