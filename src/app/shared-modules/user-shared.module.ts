import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { NavbarComponent } from '../components/common/navbar/navbar.component';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { EmailLoginCheckDirective } from "../service/async-validator.service";
import { MatInputModule } from '@angular/material/input';

@NgModule({
    declarations: [
        NavbarComponent,
        EmailLoginCheckDirective
    ],
    imports: [
        CommonModule,
        RouterModule,
        MatIconModule,
        MatProgressBarModule,
        MatInputModule
    ],
    exports: [
        NavbarComponent,
        RouterModule,
        MatIconModule,
        MatProgressBarModule,
        EmailLoginCheckDirective,
        MatInputModule
    ],
})
export class UserSharedModule { }
