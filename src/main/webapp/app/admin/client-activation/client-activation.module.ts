import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'app/shared/shared.module';
import { ClientActivationComponent } from './client-activation.component';
import { Authority } from 'app/config/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild([
      {
        path: '',
        component: ClientActivationComponent,
        canActivate: [UserRouteAccessService],
        data: {
          authorities: [Authority.ADMIN_COMMERCIAL, Authority.ADMIN],
          pageTitle: 'clientActivation.title',
        },
      },
    ]),
  ],
  declarations: [ClientActivationComponent],
})
export class ClientActivationModule {}
