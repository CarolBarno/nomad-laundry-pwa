import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { userData } from 'src/app/interface/user-data';
import { AlertService } from 'src/app/service/alert.service';
import { PasswordMatchValidator } from 'src/app/service/async-validator.service';
import { DataService } from 'src/app/service/data.service';
import { FeathersService } from 'src/app/service/feathers.service';
import { OnlineCheckService } from 'src/app/service/online-check.service';
import { OtpService } from 'src/app/service/otp.service';
import { TermsAndConditionsComponent } from '../../home/home.component';

export enum Criteria {
  at_least_five_chars,
  at_least_one_lowercase_char,
  at_least_one_uppercase_char,
  at_least_one_digit_char,
  at_least_one_special_char
}

export enum Colors {
  warn = 'red',
  accent = 'yellow',
  primary = 'green'
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers: [PasswordMatchValidator]
})
export class RegisterComponent implements OnInit, OnDestroy {

  userData: userData = {
    first_name: '',
    last_name: '',
    id_number: '',
    email: '',
    password: '',
    confirm_password: '',
    phone_number: '',
    otp: '',
    action: 'sendEmail',
    user_status: 'A',
    user_type: 1
  };
  resendButton = false;
  registerLoading = false;
  otpLoading = false;
  registrationDone = false;
  errorMessage: any;
  agreeTerms: boolean;
  generalError = false;
  userError: any;
  termsAndConditions: any;
  status = 'Weak';
  showStatus = false;
  criteriaMap = new Map<Criteria, RegExp>();
  strength: number = 0;
  containAtLeastFiveChars = false;
  containAtLeastOneLowercaseChar = false;
  containAtLeastOneUppercaseChar = false;
  containAtLeastOneDigit = false;
  containAtLeastOneSpecialChar = false;
  timer: NodeJS.Timer;
  onlineStatus: boolean;
  dissableOtpInput: boolean;
  otpExpired: boolean;
  disableRegButton: boolean;
  cLower: any; cUpper: any; cDigit: any; cSpecial: any;

  constructor(private otpService: OtpService, private dialog: MatDialog, private feathers: FeathersService,
    private snackbar: MatSnackBar, private internetService: OnlineCheckService, private alert: AlertService,
    private router: Router, private dataService: DataService) {
    this.criteriaMap.set(Criteria.at_least_five_chars, RegExp(/^.{5,30}$/));
    this.cLower = this.criteriaMap.set(Criteria.at_least_one_lowercase_char, RegExp(/^(?=.*?[a-z])/));
    this.cUpper = this.criteriaMap.set(Criteria.at_least_one_uppercase_char, RegExp(/^(?=.*?[A-Z])/));
    this.cDigit = this.criteriaMap.set(Criteria.at_least_one_digit_char, RegExp(/^(?=.*?[0-9])/));
    this.cSpecial = this.criteriaMap.set(Criteria.at_least_one_special_char, RegExp(/^(?=.*?[" !"#$%&'()*+,-./:;<=>?@[\]^_`{|}~"])/));
  }

  checkInternetConnection(): void {
    this.internetService.checkOfflineStatus().subscribe(
      status => {
        this.onlineStatus = status;
        if (status) {
          this.snackbar.open('Back online', '' + 'Online', {
            duration: 5000
          });
        } else {
          this.snackbar.open('You are offline', '' + 'Offline', {
            duration: 5000
          });
        }
      }
    );
  }

  openTerms() {
    const dialogRef = this.dialog.open(TermsAndConditionsComponent, {
      width: '650px',
      data: this.termsAndConditions || null
    });

    dialogRef.afterClosed().subscribe(result => { });
  }

  getSiteSettings() {
    this.dataService.getSiteSettings().subscribe({
      next: response => {
        if (response) {
          let [{ terms_conditions }] = response;
          this.termsAndConditions = terms_conditions;
        }
      },
      error: error => {
        return null;
      }
    });
  }

  get storedOtp() {
    return this.otpService.getItem();
  }

  userRegistration() {
    this.registrationDone = true;
    return this.feathers.service('users').create(this.userData).then(
      (data: any) => {
        this.alert.success('Account created successfully');
        setTimeout(_ => { this.router.navigate(['/accounts/login']); }, 300);
        this.registrationDone = false;
        this.otpService.clearSession();
        this.registerLoading = false;
      },
      (error: any) => {
        if (!error.code) {
          setTimeout(_ => { this.router.navigate(['/accounts/login']); }, 300);
        }
        this.registerLoading = false;
        this.registrationDone = false;
        this.errorMessage = 'Something went wrong and action could not be completed at the moment';
      }
    );
  }

  register() {
    this.registerLoading = true;
    this.confirmOtp(this.userData).then(
      (status: any) => {
        if (status) {
          return this.userRegistration();
        } else {
          this.registerLoading = false;
          let err = {
            message: 'Wrong OTP try again!',
            name: 'OTP-Error',
            stack: ''
          };
          this.handleError(err);
        }
      }
    ).catch(
      (error: any) => {
        this.dataService.logError(error);
        if (error.className == 'timeout') {
          this.errorMessage = 'The connection timeout. Please try again';
        } else {
          this.errorMessage = 'An error occured, please try again later';
        }
        this.generalError = true;
        this.registerLoading = false;
      }
    );
  }

  sendOtp(stepper?: MatStepper, form?: NgForm) {
    this.otpLoading = true;
    this.resendButton = false;
    this.generalError = false;
    this.otpService.createHashedOtp(this.userData).then(
      (response) => {
        this.otpService.setItem(response.otp);
        if (stepper) stepper.next();
        this.simulateTime(120);
        this.userError = null;
        this.otpLoading = false;
      }
    ).catch((error) => {
      if (error.className == 'timeout') {
        this.alert.error('There was a connection timeout and this action could not be completed, please try again');
      }
      this.userError = error.errors;
      this.otpLoading = false;
      for (let i in this.userError) {
        let error = {};
        error[i] = true;
        form.controls[i].setErrors(error);
      }
    });
    return;
  }

  onSubmit(form: NgForm) {
    if (form.valid) {
      this.generalError = false;
      this.resendButton = false;
      if (this.disableRegButton) {
        this.alert.info('OTP has expired, please request a new one.');
        return;
      }
      this.register();
    }
  }

  otp(stepper: MatStepper, form: NgForm) {
    this.sendOtp(stepper, form);
  }

  ngOnInit(): void {
    this.getSiteSettings();
  }

  min = 0; sec = 0;
  simulateTime(defaultTime: number) {
    if (this.timer) {
      clearInterval(this.timer);
    }
    this.timer = setInterval(() => {
      let m: any = Math.floor(defaultTime / 60);
      let s: any = defaultTime % 60;
      m = m < 10 ? '0' + m : m;
      s = s < 10 ? '0' + s : s;
      defaultTime--;
      this.min = m;
      this.sec = s;
      if (defaultTime < 0) {
        this.resendButton = true;
        this.otpExpired = true;
        this.otpService.setItem(null);
        this.dissableOtpInput = true;
        this.disableRegButton = true;
        clearInterval(this.timer);
      }
    }, 1000);
  }

  resendOtp() {
    this.sendOtp();
    this.dissableOtpInput = false;
    this.resendButton = false;
    this.disableRegButton = false;
    this.generalError = false;
    this.userData.otp = '';
    this.otpExpired = false;
  }

  handleError(error: Error) {
    this.errorMessage = error.message;
    this.generalError = true;
    this.resendButton = true;
  }

  async confirmOtp({ otp }: any) {
    let hashed = await this.otpService.decryptOtp();
    return otp === hashed.otp;
  }

  ngOnDestroy(): void {

  }

  checkPassword(): void {
    this.showStatus = true;
    if (!this.userData.password) {
      this.strength = 0;
      return;
    }
    this.calculatePasswordStrength();
  }

  // password should contain atleast 5 chars
  private _containAtLeastFiveChars(): boolean {
    this.containAtLeastFiveChars = this.userData.password.length >= 5;
    return this.containAtLeastFiveChars;
  }

  private _containAtLeastOneLowerCaseLetter(): boolean {
    this.containAtLeastOneLowercaseChar = this.cLower.get(Criteria.at_least_one_lowercase_char).test(this.userData.password);
    return this.containAtLeastOneLowercaseChar;
  }

  private _containAtLeastOneUpperCaseLetter(): boolean {
    this.containAtLeastOneUppercaseChar = this.cUpper.get(Criteria.at_least_one_uppercase_char).test(this.userData.password);
    return this.containAtLeastOneUppercaseChar;
  }

  private _containAtLeastOneDigit(): boolean {
    this.containAtLeastOneDigit = this.cDigit.get(Criteria.at_least_one_digit_char).test(this.userData.password);
    return this.containAtLeastOneDigit;
  }

  private _containAtLeastOneSpecialChar(): boolean {
    this.containAtLeastOneSpecialChar = this.cSpecial.get(Criteria.at_least_one_special_char).test(this.userData.password);
    return this.containAtLeastOneSpecialChar;
  }

  calculatePasswordStrength() {
    const requirements: boolean[] = [];
    const meter = 100 / 5;
    requirements.push(
      this._containAtLeastFiveChars(),
      this._containAtLeastOneDigit(),
      this._containAtLeastOneSpecialChar(),
      this._containAtLeastOneUpperCaseLetter(),
      this._containAtLeastOneLowerCaseLetter()
    );
    this.strength = requirements.filter(x => x).length * meter;
  }

  clearOtpTimer(): void {
    if (this.timer) {
      clearInterval(this.timer);
    }
    this.dissableOtpInput = false;
    this.disableRegButton = false;
    this.resendButton = false;
    this.generalError = false;
    this.userData.otp = '';
    this.otpExpired = false;
    this.timer;
  }

  get color() {
    if (this.strength <= 20) {
      this.status = 'Weak';
      return Colors.warn;
    } else if (this.strength <= 80) {
      this.status = 'Fair';
      return Colors.accent;
    } else {
      this.status = 'Strong';
      return Colors.primary;
    }
  }

}
