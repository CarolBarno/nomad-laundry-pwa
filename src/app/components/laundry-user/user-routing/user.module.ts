import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MainSharedModule } from 'src/app/shared-modules/main-shared.module';
import { AdminPasswordChangeComponent } from '../admin-password-change/admin-password-change.component';
import { ChangePasswordComponent } from '../change-password/change-password.component';
import { EditPhoneEmailDialog, EditProfileComponent } from '../edit-profile/edit-profile.component';
import { ProfileComponent } from '../profile/profile.component';
import { TwoStepAuthComponent } from '../two-step-auth/two-step-auth.component';
import { UserDashboardComponent } from '../user-dashboard/user-dashboard.component';
import { VerificationComponent } from '../verification/verification.component';
import { UserRoutingModule } from './user-routing.module';

@NgModule({
  declarations: [
    ProfileComponent,
    ChangePasswordComponent,
    AdminPasswordChangeComponent,
    UserDashboardComponent,
    EditProfileComponent,
    VerificationComponent,
    EditPhoneEmailDialog,
    TwoStepAuthComponent,
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    MainSharedModule
  ],
  exports: [
    MainSharedModule
  ],
  entryComponents: [
    EditPhoneEmailDialog
  ]
})
export class UserModule { }