import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LocalStorageService, SessionStorageService } from 'ngx-webstorage';

import { ApplicationConfigService } from '../config/application-config.service';
import { Login } from 'app/login/login.model';

type JwtToken = {
  id_token: string;
  refresh_token?: string;
  expires_in?: number;
};

/** sessionStorage key for the refresh token (never stored in localStorage). */
const REFRESH_TOKEN_KEY = 'refreshToken';

@Injectable({ providedIn: 'root' })
export class AuthServerProvider {
  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService,
    private sessionStorageService: SessionStorageService,
    private applicationConfigService: ApplicationConfigService
  ) {}

  getToken(): string {
    const tokenInLocalStorage: string | null = this.localStorageService.retrieve('authenticationToken');
    const tokenInSessionStorage: string | null = this.sessionStorageService.retrieve('authenticationToken');
    return tokenInLocalStorage ?? tokenInSessionStorage ?? '';
  }

  /** Returns the stored refresh token (always from sessionStorage). */
  getRefreshToken(): string | null {
    return this.sessionStorageService.retrieve(REFRESH_TOKEN_KEY);
  }

  login(credentials: Login): Observable<void> {
    return this.http
      .post<JwtToken>(this.applicationConfigService.getEndpointFor('api/authenticate'), credentials)
      .pipe(map(response => this.authenticateSuccess(response, credentials.rememberMe)));
  }

  /**
   * Calls the backend /api/refresh-token endpoint with the stored refresh token
   * and stores the new access token on success.
   */
  refreshAccessToken(): Observable<void> {
    const refreshToken = this.getRefreshToken();
    return this.http
      .post<JwtToken>(this.applicationConfigService.getEndpointFor('api/refresh-token'), { refresh_token: refreshToken })
      .pipe(map(response => this.storeAccessToken(response.id_token)));
  }

  logout(): Observable<void> {
    return new Observable(observer => {
      this.localStorageService.clear('authenticationToken');
      this.sessionStorageService.clear('authenticationToken');
      this.sessionStorageService.clear(REFRESH_TOKEN_KEY);
      observer.complete();
    });
  }

  private authenticateSuccess(response: JwtToken, rememberMe: boolean): void {
    const jwt = response.id_token;
    if (rememberMe) {
      this.localStorageService.store('authenticationToken', jwt);
      this.sessionStorageService.clear('authenticationToken');
    } else {
      this.sessionStorageService.store('authenticationToken', jwt);
      this.localStorageService.clear('authenticationToken');
    }
    // Refresh token is always stored only in sessionStorage
    if (response.refresh_token) {
      this.sessionStorageService.store(REFRESH_TOKEN_KEY, response.refresh_token);
    }
  }

  private storeAccessToken(jwt: string): void {
    if (this.localStorageService.retrieve('authenticationToken')) {
      this.localStorageService.store('authenticationToken', jwt);
    } else {
      this.sessionStorageService.store('authenticationToken', jwt);
    }
  }
}
