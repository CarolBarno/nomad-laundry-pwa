import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MainSharedModule } from 'src/app/shared-modules/main-shared.module';
import { OneColumnLayoutComponent } from '../pages/one-column';
import { PagesComponent } from '../pages/pages.component';
import { AdminHomeComponent } from '../views/admin-home/admin-home.component';
import { AdminNavbarComponent } from '../views/admin-navbar/admin-navbar.component';
import { DashboardComponent } from '../views/dashboard/dashboard.component';
import { AdminRoutingModule } from './admin-routing.module';

@NgModule({
    declarations: [
        PagesComponent,
        DashboardComponent,
        OneColumnLayoutComponent,
        AdminNavbarComponent,
        AdminHomeComponent
    ],
    imports: [
        CommonModule,
        AdminRoutingModule,
        MainSharedModule
    ],
})
export class AdminModule { }