import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/common/login/login.component';
import { NotFoundPageComponent } from './components/common/not-found-page/not-found-page.component';
import { HomeComponent } from './components/home/home.component';

const routes: Routes = [
  {
    path: 'profile',
    loadChildren: () => import('./components/laundry-user/user-routing/user.module').then(m => m.UserModule)
  },
  {
    path: 'admin',
    loadChildren: () => import('./components/admin-panel/admin-routing/admin.module').then(m => m.AdminModule)
  },
  {
    path: 'accounts/login',
    component: LoginComponent,
    canActivate: []
  },
  {
    path: '',
    component: HomeComponent,
    canActivate: []
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
