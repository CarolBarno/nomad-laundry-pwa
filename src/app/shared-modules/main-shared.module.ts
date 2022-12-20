import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { NavbarComponent } from '../components/common/navbar/navbar.component';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { EmailLoginCheckDirective, MustMatchDirective } from "../service/async-validator.service";
import { MatInputModule } from '@angular/material/input';
import { UserDisplayPipe } from "../pipes/user-display.pipe";
import { NbMenuModule, NbSidebarModule, NbLayoutModule, NbIconModule, NbUserModule, NbActionsModule, NbContextMenuModule, NbSelectModule } from "@nebular/theme";
import { NbEvaIconsModule } from "@nebular/eva-icons";
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatStepperModule } from '@angular/material/stepper';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from "@angular/forms";
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';

@NgModule({
    declarations: [
        NavbarComponent,
        EmailLoginCheckDirective,
        UserDisplayPipe,
        MustMatchDirective
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
        NbSelectModule,
        MatSnackBarModule,
        MatDialogModule,
        MatStepperModule,
        MatCheckboxModule,
        MatPaginatorModule,
        MatCardModule,
        FormsModule,
        MatTabsModule,
        MatChipsModule,
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
        NbSelectModule,
        MatSnackBarModule,
        MatDialogModule,
        MatStepperModule,
        MustMatchDirective,
        MatCheckboxModule,
        MatPaginatorModule,
        MatCardModule,
        FormsModule,
        MatTabsModule,
        MatChipsModule,
    ],
})
export class MainSharedModule { }
