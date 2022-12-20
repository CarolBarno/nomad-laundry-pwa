import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { HomeComponent, TermsAndConditionsComponent } from './components/home/home.component';
import { NotFoundPageComponent } from './components/common/not-found-page/not-found-page.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FooterComponent } from './components/common/footer/footer.component';
import { MainSharedModule } from './shared-modules/main-shared.module';
import { LoginComponent } from './components/common/login/login.component';
import { FormsModule } from '@angular/forms';
import { NbThemeModule } from '@nebular/theme';
import { AuthService } from './service/auth.service';
import { FeathersService } from './service/feathers.service';
import { RegisterComponent } from './components/common/register/register.component';
import { ProgressColorDirective } from './directives/progress-color.directive';
import { ChangeDefaultPasswordComponent } from './components/laundry-user/change-default-password/change-default-password.component';
import { GuardGuard } from './guard/guard.guard';
import { CommonTwoStepAuthComponent } from './components/common/common-two-step-auth/common-two-step-auth.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NotFoundPageComponent,
    FooterComponent,
    LoginComponent,
    RegisterComponent,
    TermsAndConditionsComponent,
    ProgressColorDirective,
    ChangeDefaultPasswordComponent,
    CommonTwoStepAuthComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
    BrowserAnimationsModule,
    MainSharedModule,
    FormsModule,
    NbThemeModule.forRoot({ name: 'default' })
  ],
  providers: [
    AuthService,
    FeathersService,
    GuardGuard
  ],
  bootstrap: [AppComponent],
  entryComponents: [TermsAndConditionsComponent]
})
export class AppModule { }
