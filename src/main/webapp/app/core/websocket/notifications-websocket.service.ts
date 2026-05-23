import { Injectable, OnDestroy } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { RxStomp } from '@stomp/rx-stomp';

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

@Injectable({ providedIn: 'root' })
export class NotificationsWebSocketService implements OnDestroy {
  private stompClient: RxStomp | null = null;
  private stompSubscription: Subscription | null = null;
  private authSubscription?: Subscription;

  private _notifications$ = new Subject<NotificationDTO>();
  readonly notifications$ = this._notifications$.asObservable();

  constructor(private accountService: AccountService, private authServerProvider: AuthServerProvider) {
    this.authSubscription = this.accountService.getAuthenticationState().subscribe((account: Account | null) => {
      if (account?.login) {
        this.connect(account.login);
      } else {
        this.disconnect();
      }
    });
  }

  private connect(login: string): void {
    this.disconnect();

    const token = this.authServerProvider.getToken();
    const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
    const host = window.location.host;
    const wsUrl = `${protocol}://${host}/services/platform/ws/websocket?access_token=${encodeURIComponent(token)}`;

    try {
      const client = new RxStomp();
      client.configure({
        brokerURL: wsUrl,
        connectHeaders: { login, passcode: token },
        heartbeatIncoming: 0,
        heartbeatOutgoing: 20000,
        reconnectDelay: 5000,
      });
      client.activate();

      this.stompClient = client;
      this.stompSubscription = client.watch(`/topic/notifications/${login}`).subscribe({
        next: (message: { body: string }) => {
          try {
            const notif: NotificationDTO = JSON.parse(message.body);
            this._notifications$.next(notif);
          } catch {
            // message malformé — ignorer
          }
        },
        error: err => console.warn('[NotificationsWebSocketService] subscription error', err),
      });
    } catch (err) {
      console.warn('[NotificationsWebSocketService] WebSocket désactivé :', err);
    }
  }

  private disconnect(): void {
    try {
      this.stompSubscription?.unsubscribe();
      void this.stompClient?.deactivate();
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
