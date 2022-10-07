import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { NavbarComponent } from '../components/common/navbar/navbar.component';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { EmailLoginCheckDirective } from "../service/async-validator.service";
import { MatInputModule } from '@angular/material/input';
import { UserDisplayPipe } from "../pipes/user-display.pipe";
import { NbMenuModule, NbSidebarModule, NbLayoutModule, NbIconModule, NbUserModule, NbActionsModule, NbContextMenuModule, NbSelectModule } from "@nebular/theme";
import { NbEvaIconsModule } from "@nebular/eva-icons";

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
        MatInputModule,
        NbSidebarModule.forRoot(),
        NbMenuModule.forRoot(),
        NbIconModule,
        NbLayoutModule,
        NbActionsModule,
        NbUserModule,
        NbContextMenuModule,
        NbEvaIconsModule,
        NbSelectModule
    ],
    exports: [
        NavbarComponent,
        RouterModule,
        MatIconModule,
        MatProgressBarModule,
        EmailLoginCheckDirective,
        MatInputModule,
        UserDisplayPipe,
        NbIconModule,
        NbLayoutModule,
        NbMenuModule,
        NbSidebarModule,
        NbActionsModule,
        NbUserModule,
        NbContextMenuModule,
        NbEvaIconsModule,
        NbSelectModule
    ],
})
export class MainSharedModule { }
