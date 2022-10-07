import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { NavbarComponent } from '../components/common/navbar/navbar.component';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { EmailLoginCheckDirective } from "../service/async-validator.service";
import { MatInputModule } from '@angular/material/input';
import { UserDisplayPipe } from "../pipes/user-display.pipe";

@NgModule({
    declarations: [
        NavbarComponent,
        EmailLoginCheckDirective,
        UserDisplayPipe
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
        MatInputModule,
        UserDisplayPipe
    ],
})
export class UserSharedModule { }
