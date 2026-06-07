import { Injectable, OnDestroy } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { RxStomp } from '@stomp/rx-stomp';

import { AccountService } from 'app/core/auth/account.service';
import { AuthServerProvider } from 'app/core/auth/auth-jwt.service';
import { Account } from 'app/core/auth/account.model';

export interface NotificationDTO {
  id?: number;
  type?: string;
  // Champs réellement émis par le backend (NotificationDTO côté PlatformService)
  title?: string;
  body?: string;
  payloadJson?: string;
  recipientLogin?: string;
  isRead?: boolean;
  // Champs legacy / dérivés côté client
  message?: string;
  targetLogin?: string;
  read?: boolean;
  createdAt?: string;
  targetUrl?: string;
}

@Injectable({ providedIn: 'root' })
export class NotificationsWebSocketService implements OnDestroy {
  private stompClient: RxStomp | null = null;
  private stompSubscriptions: Subscription[] = [];
  private authSubscription?: Subscription;

  private _notifications$ = new Subject<NotificationDTO>();
  readonly notifications$ = this._notifications$.asObservable();

  constructor(private accountService: AccountService, private authServerProvider: AuthServerProvider) {
    this.authSubscription = this.accountService.getAuthenticationState().subscribe((account: Account | null) => {
      if (account?.login) {
        this.connect(account.login, account.authorities ?? []);
      } else {
        this.disconnect();
      }
    });
  }

  private connect(login: string, authorities: string[]): void {
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

      // Topic personnel + un topic par rôle (ex. /topic/notifications/role/ROLE_ADMIN_COMMERCIAL),
      // afin de recevoir les notifications diffusées à un groupe de rôle.
      const topics = [`/topic/notifications/${login}`, ...authorities.map(role => `/topic/notifications/role/${role}`)];
      this.stompSubscriptions = topics.map(topic =>
        client.watch(topic).subscribe({
          next: (message: { body: string }) => {
            try {
              const notif: NotificationDTO = JSON.parse(message.body);
              this._notifications$.next(notif);
            } catch {
              // message malformé — ignorer
            }
          },
          error: err => console.warn('[NotificationsWebSocketService] subscription error', err),
        })
      );
    } catch (err) {
      console.warn('[NotificationsWebSocketService] WebSocket désactivé :', err);
    }
  }

  private disconnect(): void {
    try {
      this.stompSubscriptions.forEach(sub => sub.unsubscribe());
      void this.stompClient?.deactivate();
    } catch {
      // ignore
    }
    this.stompSubscriptions = [];
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
