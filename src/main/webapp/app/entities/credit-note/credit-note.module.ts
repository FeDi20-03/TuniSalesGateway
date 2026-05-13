import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from 'app/shared/shared.module';
import { CreditNoteComponent } from './credit-note.component';
import { Authority } from 'app/config/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

@NgModule({
  imports: [
    SharedModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      {
        path: '',
        component: CreditNoteComponent,
        canActivate: [UserRouteAccessService],
        data: {
          authorities: [Authority.ADMIN_COMMERCIAL, Authority.COMMERCIAL, Authority.ADMIN],
          pageTitle: 'creditNote.title',
        },
      },
    ]),
  ],
  declarations: [CreditNoteComponent],
})
export class CreditNoteModule {}
