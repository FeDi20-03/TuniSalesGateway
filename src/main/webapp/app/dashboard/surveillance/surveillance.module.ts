import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { SharedModule } from 'app/shared/shared.module';
import { SurveillanceComponent } from './surveillance.component';
import { Authority } from 'app/config/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

@NgModule({
  imports: [
    SharedModule,
    FormsModule,
    RouterModule.forChild([
      {
        path: '',
        component: SurveillanceComponent,
        canActivate: [UserRouteAccessService],
        data: {
          authorities: [Authority.ADMIN_COMMERCIAL, Authority.ADMIN_SYSTEME, Authority.ADMIN],
          pageTitle: 'surveillance.title',
        },
      },
    ]),
  ],
  declarations: [SurveillanceComponent],
})
export class SurveillanceModule {}
