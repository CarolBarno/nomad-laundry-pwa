import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MainSharedModule } from 'src/app/shared-modules/main-shared.module';
import { AdminPasswordChangeComponent } from '../admin-password-change/admin-password-change.component';
import { ChangePasswordComponent } from '../change-password/change-password.component';
import { ProfileComponent } from '../profile/profile.component';
import { UserDashboardComponent } from '../user-dashboard/user-dashboard.component';
import { UserRoutingModule } from './user-routing.module';

@NgModule({
  declarations: [
    ProfileComponent,
    ChangePasswordComponent,
    AdminPasswordChangeComponent,
    UserDashboardComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    MainSharedModule
  ],
  exports: [
    MainSharedModule
  ]
})
export class UserModule { }