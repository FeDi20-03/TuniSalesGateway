import { Injectable, OnDestroy } from '@angular/core';
import { Subject, Subscription } from 'rxjs';

import { AccountService } from 'app/core/auth/account.service';
import { AuthServerProvider } from 'app/core/auth/auth-jwt.service';
import { Account } from 'app/core/auth/account.model';

export interface NotificationDTO {
  id?: number;
  type?: string;
  message?: string;
  targetLogin?: string;
  read?: boolean;
  createdAt?: string;
  targetUrl?: string;
}

// Escape TypeScript static module resolution so the build doesn't fail
// when @stomp/rx-stomp is not yet installed.
const dynamicImport = new Function('m', 'return import(m)') as (m: string) => Promise<any>;

@Injectable({ providedIn: 'root' })
export class NotificationsWebSocketService implements OnDestroy {
  private stompClient: any = null;
  private stompSubscription: any = null;
  private authSubscription?: Subscription;

  private _notifications$ = new Subject<NotificationDTO>();
  readonly notifications$ = this._notifications$.asObservable();

  constructor(private accountService: AccountService, private authServerProvider: AuthServerProvider) {
    this.authSubscription = this.accountService.getAuthenticationState().subscribe((account: Account | null) => {
      if (account) {
        this.connect(account.login);
      } else {
        this.disconnect();
      }
    });
  }

  private connect(login: string): void {
    const token = this.authServerProvider.getToken();
    const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
    const host = window.location.host;
    const wsUrl = `${protocol}://${host}/services/platform/ws/websocket?access_token=${encodeURIComponent(token)}`;

    dynamicImport('@stomp/rx-stomp')
      .then(({ RxStomp }) => {
        this.stompClient = new RxStomp();
        this.stompClient.configure({
          brokerURL: wsUrl,
          connectHeaders: { login, passcode: token },
          heartbeatIncoming: 0,
          heartbeatOutgoing: 20000,
          reconnectDelay: 5000,
        });
        this.stompClient.activate();

        this.stompSubscription = this.stompClient.watch(`/topic/notifications/${login}`).subscribe((message: { body: string }) => {
          try {
            const notif: NotificationDTO = JSON.parse(message.body);
            this._notifications$.next(notif);
          } catch {
            // ignore malformed message
          }
        });
      })
      .catch(() => {
        console.warn('[NotificationsWebSocketService] @stomp/rx-stomp not available — WS disabled.');
      });
  }

  private disconnect(): void {
    try {
      this.stompSubscription?.unsubscribe?.();
      this.stompClient?.deactivate?.();
    } catch {
      // ignore
    }
    this.stompSubscription = null;
    this.stompClient = null;
  }

  emit(notification: NotificationDTO): void {
    this._notifications$.next(notification);
  }

  ngOnDestroy(): void {
    this.disconnect();
    this.authSubscription?.unsubscribe();
  }
}
