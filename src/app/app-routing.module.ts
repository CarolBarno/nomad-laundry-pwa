import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/common/login/login.component';
import { NotFoundPageComponent } from './components/common/not-found-page/not-found-page.component';
import { RegisterComponent } from './components/common/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { ChangeDefaultPasswordComponent } from './components/laundry-user/change-default-password/change-default-password.component';
import { EnforceDefaultPasswordChangeGuard } from './guard/enforce-default-password-change.guard';
import { PreventChangesGuard } from './guard/password-change/prevent-changes.guard';
import { RedirectAuthGuard } from './guard/protect-login/redirect-auth.guard';
import { TwoStepAuthGuard } from './guard/two-step-auth.guard';

const routes: Routes = [
  {
    path: 'profile',
    loadChildren: () => import('./components/laundry-user/user-routing/user.module').then(m => m.UserModule)
  },
  {
    path: 'admin',
    canActivate: [EnforceDefaultPasswordChangeGuard],
    loadChildren: () => import('./components/admin-panel/admin-routing/admin.module').then(m => m.AdminModule)
  },
  {
    path: "accounts/register",
    component: RegisterComponent,
    canActivate: [RedirectAuthGuard]
  },
  {
    path: 'accounts/login',
    component: LoginComponent,
    canActivate: [RedirectAuthGuard]
  },
  {
    path: 'user/password-change',
    component: ChangeDefaultPasswordComponent,
    canActivate: [PreventChangesGuard]
  },
  {
    path: '',
    component: HomeComponent,
    canActivate: [EnforceDefaultPasswordChangeGuard, TwoStepAuthGuard]
  },
  {
    path: '**',
    component: NotFoundPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
