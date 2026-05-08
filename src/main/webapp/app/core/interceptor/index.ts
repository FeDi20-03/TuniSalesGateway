import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { AuthInterceptor } from 'app/core/interceptor/auth.interceptor';
import { AuthExpiredInterceptor } from 'app/core/interceptor/auth-expired.interceptor';
import { ErrorHandlerInterceptor } from 'app/core/interceptor/error-handler.interceptor';
import { NotificationInterceptor } from 'app/core/interceptor/notification.interceptor';
import { TokenRefreshInterceptor } from 'app/core/interceptor/token-refresh.interceptor';

export const httpInterceptorProviders = [
  {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true,
  },
  // TokenRefreshInterceptor must come before AuthExpiredInterceptor so that a
  // transparent token refresh is attempted before triggering a logout.
  {
    provide: HTTP_INTERCEPTORS,
    useClass: TokenRefreshInterceptor,
    multi: true,
  },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthExpiredInterceptor,
    multi: true,
  },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: ErrorHandlerInterceptor,
    multi: true,
  },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: NotificationInterceptor,
    multi: true,
  },
];
