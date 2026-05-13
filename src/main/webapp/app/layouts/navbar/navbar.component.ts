import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SessionStorageService } from 'ngx-webstorage';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Subscription } from 'rxjs';

import { VERSION } from 'app/app.constants';
import { LANGUAGES } from 'app/config/language.constants';
import { Account } from 'app/core/auth/account.model';
import { AccountService } from 'app/core/auth/account.service';
import { LoginService } from 'app/login/login.service';
import { ProfileService } from 'app/layouts/profiles/profile.service';
import { EntityNavbarItems } from 'app/entities/entity-navbar-items';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { AlertService } from 'app/core/util/alert.service';
import { NotificationsWebSocketService, NotificationDTO } from 'app/core/websocket/notifications-websocket.service';

@Component({
  selector: 'jhi-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  inProduction?: boolean;
  isNavbarCollapsed = true;
  languages = LANGUAGES;
  openAPIEnabled?: boolean;
  version = '';
  account: Account | null = null;
  entitiesNavbarItems: any[] = [];

  // Notifications
  unreadCount = 0;
  recentNotifications: NotificationDTO[] = [];
  private wsSubscription?: Subscription;
  private notifUrl: string;

  constructor(
    private loginService: LoginService,
    private translateService: TranslateService,
    private sessionStorageService: SessionStorageService,
    private accountService: AccountService,
    private profileService: ProfileService,
    private http: HttpClient,
    private applicationConfigService: ApplicationConfigService,
    private alertService: AlertService,
    private wsService: NotificationsWebSocketService,
    protected router: Router
  ) {
    if (VERSION) {
      this.version = VERSION.toLowerCase().startsWith('v') ? VERSION : `v${VERSION}`;
    }
    this.notifUrl = this.applicationConfigService.getEndpointFor('api/notifications', 'platformservice');
  }

  ngOnInit(): void {
    this.entitiesNavbarItems = EntityNavbarItems;
    this.profileService.getProfileInfo().subscribe(profileInfo => {
      this.inProduction = profileInfo.inProduction;
      this.openAPIEnabled = profileInfo.openAPIEnabled;
    });

    this.accountService.getAuthenticationState().subscribe(account => {
      this.account = account;
      if (account) {
        this.loadUnreadCount();
      } else {
        this.unreadCount = 0;
        this.recentNotifications = [];
      }
    });

    // Ecoute WebSocket: auto-toaster + badge refresh
    this.wsSubscription = this.wsService.notifications$.subscribe((notif: NotificationDTO) => {
      this.recentNotifications.unshift(notif);
      if (this.recentNotifications.length > 5) this.recentNotifications.pop();
      this.unreadCount++;
      if (notif.message) {
        this.alertService.addAlert({ type: 'info', message: notif.message, timeout: 5000 });
      }
    });
  }

  ngOnDestroy(): void {
    this.wsSubscription?.unsubscribe();
  }

  loadUnreadCount(): void {
    this.http.get<{ count: number }>(`${this.notifUrl}/me/unread-count`).subscribe({
      next: res => (this.unreadCount = res.count ?? 0),
      error: () => (this.unreadCount = 0),
    });
    // Charger les 5 dernières
    let params = new HttpParams();
    params = params.set('size', '5').set('sort', 'createdAt,desc');
    this.http.get<NotificationDTO[]>(`${this.notifUrl}/me`, { params }).subscribe({
      next: notifs => (this.recentNotifications = notifs),
      error: () => {},
    });
  }

  navigateToNotification(notif: NotificationDTO): void {
    if (notif.targetUrl) {
      this.router.navigateByUrl(notif.targetUrl);
    }
  }

  changeLanguage(languageKey: string): void {
    this.sessionStorageService.store('locale', languageKey);
    this.translateService.use(languageKey);
  }

  collapseNavbar(): void {
    this.isNavbarCollapsed = true;
  }

  login(): void {
    this.router.navigate(['/login']);
  }

  logout(): void {
    this.collapseNavbar();
    this.loginService.logout();
    this.router.navigate(['/login']);
  }

  toggleNavbar(): void {
    this.isNavbarCollapsed = !this.isNavbarCollapsed;
  }
}
