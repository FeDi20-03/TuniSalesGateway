import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';

import { AuthServerProvider } from 'app/core/auth/auth-jwt.service';

/**
 * HTTP interceptor that transparently refreshes the access token on 401 responses.
 *
 * When a 401 is received (and a refresh token is available) the interceptor:
 *  1. Calls POST /api/refresh-token once (subsequent 401s wait for the result).
 *  2. Retries the original request with the new access token.
 *  3. If the refresh itself fails, the error is re-thrown (caller handles logout).
 */
@Injectable()
export class TokenRefreshInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

  constructor(private authServerProvider: AuthServerProvider) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Never attempt a refresh for the auth/refresh endpoints themselves
    if (this.isAuthEndpoint(request.url)) {
      return next.handle(request);
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 && this.authServerProvider.getRefreshToken()) {
          return this.handle401Error(request, next);
        }
        return throwError(() => error);
      })
    );
  }

  private handle401Error(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.authServerProvider.refreshAccessToken().pipe(
        switchMap(() => {
          this.isRefreshing = false;
          const newToken = this.authServerProvider.getToken();
          this.refreshTokenSubject.next(newToken);
          return next.handle(this.addToken(request, newToken));
        }),
        catchError(err => {
          this.isRefreshing = false;
          return throwError(() => err);
        })
      );
    }

    // Another request already triggered a refresh — wait for it to complete
    return this.refreshTokenSubject.pipe(
      filter(token => token !== null),
      take(1),
      switchMap(token => next.handle(this.addToken(request, token!)))
    );
  }

  private addToken(request: HttpRequest<unknown>, token: string): HttpRequest<unknown> {
    return request.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
  }

  private isAuthEndpoint(url: string): boolean {
    return url.includes('api/authenticate') || url.includes('api/refresh-token');
  }
}
