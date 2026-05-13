import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { ClientActivationComponent } from './client-activation.component';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { SharedModule } from 'app/shared/shared.module';

describe('ClientActivationComponent', () => {
  let component: ClientActivationComponent;
  let fixture: ComponentFixture<ClientActivationComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, SharedModule],
      declarations: [ClientActivationComponent],
      providers: [ApplicationConfigService],
    }).compileComponents();

    fixture = TestBed.createComponent(ClientActivationComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    fixture.detectChanges();
    const req = httpMock.expectOne(r => r.url.includes('api/admin/users'));
    req.flush([]);
    expect(component).toBeTruthy();
  });

  it('should load pending users on init', () => {
    const mockUsers = [
      { id: 1, login: 'client1', firstName: 'Jean', lastName: 'Dupont', email: 'j@d.fr', activated: false, authorities: ['ROLE_CLIENT'] },
    ];
    fixture.detectChanges();
    const req = httpMock.expectOne(r => r.url.includes('api/admin/users'));
    req.flush(mockUsers, { headers: {} });
    expect(component.pendingUsers.length).toBe(1);
  });

  it('should remove user from list after activation', () => {
    component.pendingUsers = [
      { id: 1, login: 'client1', firstName: 'Jean', lastName: 'Dupont', email: 'j@d.fr', activated: false, authorities: ['ROLE_CLIENT'] },
    ];
    component.activate(component.pendingUsers[0]);
    const req = httpMock.expectOne(r => r.method === 'PUT');
    req.flush({ id: 1, activated: true });
    expect(component.pendingUsers.length).toBe(0);
  });

  it('should remove user from list after rejection', () => {
    component.pendingUsers = [
      { id: 1, login: 'client1', firstName: 'Jean', lastName: 'Dupont', email: 'j@d.fr', activated: false, authorities: ['ROLE_CLIENT'] },
    ];
    component.reject(component.pendingUsers[0]);
    const req = httpMock.expectOne(r => r.method === 'PUT');
    req.flush({ id: 1, activated: false });
    expect(component.pendingUsers.length).toBe(0);
  });
});
