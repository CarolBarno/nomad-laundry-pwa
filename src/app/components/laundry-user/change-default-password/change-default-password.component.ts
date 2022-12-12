import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { IPassword } from 'src/app/interface/password-change';
import { AlertService } from 'src/app/service/alert.service';
import { AuthService } from 'src/app/service/auth.service';
import { DataService } from 'src/app/service/data.service';
import { OtpService } from 'src/app/service/otp.service';

@Component({
  selector: 'app-change-default-password',
  templateUrl: './change-default-password.component.html',
  styleUrls: ['./change-default-password.component.css']
})
export class ChangeDefaultPasswordComponent implements OnInit, OnDestroy {

  passwordChangeForm: IPassword = {
    password: null,
    confirm_password: null,
    user_status: 'A',
    otp: null,
    action: 'enforcePasswordChange'
  };

  viewOtpField: boolean = false;
  timer: NodeJS.Timer;
  otpRequest: boolean;
  currentUser: any;
  passwordChange: boolean;

  constructor(private otpService: OtpService, private dataService: DataService, private auth: AuthService,
    private router: Router, private alert: AlertService) { }

  ngOnInit(): void {
  }

  private confirmPasswordMatch({ password, confirm_password }): boolean {
    return ((password.length >= 5) && (Object.is(password, confirm_password)));
  }

  getOtp() {
    const valid = this.confirmPasswordMatch(this.passwordChangeForm);
    if (valid) this.requestOtp();
  }

  showPasswordField() {
    this.viewOtpField = false;
  }

  async requestOtp() {
    this.otpRequest = true;
    const currentUser = await this.auth.getCurrentUser();
    if (!currentUser) {
      this.alert.info('Please login to continue. Redirecting you in 5 seconds');
      this.timer = setTimeout(() => {
        this.router.navigate(['/accounts/login']);
      }, 5000);
      return;
    }

    const { first_name, last_name, phone_number, user_status, email, id } = currentUser.user;
    if (user_status.toLowerCase() !== 'p') {
      this.alert.info('Your password is already changes.');
      this.timer = setTimeout(() => {
        this.router.navigate(['/accounts/login']);
      }, 5000);
      return;
    }

    this.currentUser = currentUser.user;
    const otpData: any = {
      first_name,
      last_name,
      phone_number,
      email,
      id,
      sendEmail: true
    };

    this.otpService.createHashedOtp(otpData).then(response => {
      this.otpService.setItem(response.otp);
      this.otpRequest = false;
      this.viewOtpField = true;
    });
  }

  changePassword(form: NgForm) {
    if (form.valid) {
      const { otp } = this.passwordChangeForm;
      this.passwordChange = true;
      this.otpService.decryptOtp().then(response => {
        if (Object.is(otp, response.otp)) {
          this.changeDefaultPassword(this.passwordChangeForm);
        } else {
          this.alert.error('Invalid OTP provided');
          this.passwordChange = false;
        }
      }).catch(e => {
        this.passwordChange = false;
        this.alert.info('An error has occured and your request could not be completed at the moment. Please try again later.');
      })
    }
  }

  changeDefaultPassword(form: any) {
    this.passwordChange = true;
    this.dataService.changePassword(form, this.currentUser.id).subscribe({
      next: response => {
        this.passwordChange = false;
        this.alert.success('Password changed successfully, redirecting to home page.');
        this.timer = setTimeout(() => {
          location.reload();
        }, 3000);
      },
      error: error => {
        this.passwordChange = false;
        this.alert.error(error.message, 'Password change failed');
      }
    });
  }

  ngOnDestroy(): void {
    clearTimeout(this.timer);
  }

}
