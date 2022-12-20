import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EnforceDefaultPasswordChangeGuard } from 'src/app/guard/enforce-default-password-change.guard';
import { GuardGuard } from 'src/app/guard/guard.guard';
import { TwoStepAuthGuard } from 'src/app/guard/two-step-auth.guard';
import { ChangePasswordComponent } from '../change-password/change-password.component';
import { EditProfileComponent } from '../edit-profile/edit-profile.component';
import { ProfileComponent } from '../profile/profile.component';
import { TwoStepAuthComponent } from '../two-step-auth/two-step-auth.component';
import { UserDashboardComponent } from '../user-dashboard/user-dashboard.component';
import { VerificationComponent } from '../verification/verification.component';

const routes: Routes = [
  {
    path: '',
    component: ProfileComponent,
    canActivate: [GuardGuard, EnforceDefaultPasswordChangeGuard, TwoStepAuthGuard],
    children: [
      {
        path: 'edit-profile',
        component: EditProfileComponent
      },
      {
        path: 'change-password',
        component: ChangePasswordComponent
      },
      {
        path: 'verification',
        component: VerificationComponent
      },
      {
        path: 'security',
        component: TwoStepAuthComponent
      },
      // should always be the last route in this array
      {
        path: ':name',
        component: UserDashboardComponent
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CommonModule
  ],
  exports: [RouterModule]
})
export class UserRoutingModule { }