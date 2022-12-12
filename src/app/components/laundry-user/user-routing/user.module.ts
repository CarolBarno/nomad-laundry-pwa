import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AdminPasswordChangeComponent } from '../admin-password-change/admin-password-change.component';
import { ChangePasswordComponent } from '../change-password/change-password.component';
import { ProfileComponent } from '../profile/profile.component';

@NgModule({
  declarations: [
    ProfileComponent,
    ChangePasswordComponent,
    AdminPasswordChangeComponent
  ],
  imports: [
    CommonModule
  ],
})
export class UserModule { }