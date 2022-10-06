import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {
        path: '',
        canActivate: [],
        children: []
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