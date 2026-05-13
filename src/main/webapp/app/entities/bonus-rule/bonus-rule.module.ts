import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from 'app/shared/shared.module';
import { BonusRuleComponent } from './bonus-rule.component';
import { Authority } from 'app/config/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

@NgModule({
  imports: [
    SharedModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      {
        path: '',
        component: BonusRuleComponent,
        canActivate: [UserRouteAccessService],
        data: {
          authorities: [Authority.ADMIN_COMMERCIAL, Authority.ADMIN_SYSTEME, Authority.ADMIN],
          pageTitle: 'bonusRule.title',
        },
      },
    ]),
  ],
  declarations: [BonusRuleComponent],
})
export class BonusRuleModule {}
