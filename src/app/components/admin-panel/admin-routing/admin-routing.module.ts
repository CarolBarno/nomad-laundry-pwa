import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EnforcePassChangeGuard } from 'src/app/guard/admin-pass-change/enforce-pass-change.guard';
import { IsAdminGuard } from 'src/app/guard/is-admin.guard';
import { AdminHomeComponent } from '../views/admin-home/admin-home.component';
import { DashboardComponent } from '../views/dashboard/dashboard.component';

const routes: Routes = [
    {
        path: '',
        component: DashboardComponent,
        canActivate: [IsAdminGuard, EnforcePassChangeGuard],
        children: [
            {
                path: '',
                component: AdminHomeComponent
            },
            {
                path: '',
                redirectTo: 'admin',
                pathMatch: 'full'
            },
            {
                path: '*',
                redirectTo: 'notFoundPage',
                pathMatch: 'full'
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
export class AdminRoutingModule { }