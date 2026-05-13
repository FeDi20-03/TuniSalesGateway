import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Subject } from 'rxjs';

import { NotificationsWebSocketService, NotificationDTO } from './notifications-websocket.service';
import { AccountService } from 'app/core/auth/account.service';
import { AuthServerProvider } from 'app/core/auth/auth-jwt.service';

describe('NotificationsWebSocketService', () => {
  let service: NotificationsWebSocketService;
  const authState$ = new Subject<any>();
  const mockAccountService = { getAuthenticationState: () => authState$.asObservable() };
  const mockAuthProvider = { getToken: () => 'mock-token' };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        NotificationsWebSocketService,
        { provide: AccountService, useValue: mockAccountService },
        { provide: AuthServerProvider, useValue: mockAuthProvider },
      ],
    });
    service = TestBed.inject(NotificationsWebSocketService);
  });

  afterEach(() => {
    service.ngOnDestroy();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should emit notifications via emit()', done => {
    const notif: NotificationDTO = { type: 'ORDER_VALIDATED', message: 'Commande validée' };
    service.notifications$.subscribe(n => {
      expect(n).toEqual(notif);
      done();
    });
    service.emit(notif);
  });

  it('should not error when no account is logged in', () => {
    authState$.next(null);
    expect(service).toBeTruthy();
  });
});
