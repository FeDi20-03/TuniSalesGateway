import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderNewWizardComponent } from './order-new-wizard.component';

describe('OrderNewWizardComponent', () => {
  let component: OrderNewWizardComponent;
  let fixture: ComponentFixture<OrderNewWizardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OrderNewWizardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OrderNewWizardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
