import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EnforceDefaultPasswordChangeGuard } from 'src/app/guard/enforce-default-password-change.guard';
import { GuardGuard } from 'src/app/guard/guard.guard';
import { TwoStepAuthGuard } from 'src/app/guard/two-step-auth.guard';
import { ChangePasswordComponent } from '../change-password/change-password.component';
import { ProfileComponent } from '../profile/profile.component';

const routes: Routes = [
  {
    path: '',
    component: ProfileComponent,
    canActivate: [GuardGuard, EnforceDefaultPasswordChangeGuard, TwoStepAuthGuard],
    children: [
      {
        path: 'change-password',
        component: ChangePasswordComponent
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