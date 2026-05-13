import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from 'app/shared/shared.module';
import { PlanVenteComponent } from './plan-vente.component';
import { Authority } from 'app/config/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

@NgModule({
  imports: [
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      {
        path: '',
        component: PlanVenteComponent,
        canActivate: [UserRouteAccessService],
        data: {
          authorities: [Authority.ADMIN_COMMERCIAL, Authority.ADMIN_SYSTEME, Authority.ADMIN],
          pageTitle: 'planVente.title',
        },
      },
    ]),
  ],
  declarations: [PlanVenteComponent],
})
export class PlanVenteModule {}
