import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AlertService } from 'src/app/service/alert.service';
import { AuthService } from 'src/app/service/auth.service';
import { DataService } from 'src/app/service/data.service';
import { OtpService } from 'src/app/service/otp.service';

@Component({
  selector: 'app-two-step-auth',
  templateUrl: './two-step-auth.component.html',
  styleUrls: ['./two-step-auth.component.css']
})
export class TwoStepAuthComponent implements OnInit {

  lastDigit = '';
  currentUser: any;
  otpForm = {
    otp: null
  };
  error: boolean;
  submittingOtp: boolean;
  otpSent: boolean;

  constructor(private dataService: DataService, private authService: AuthService, private alert: AlertService,
    private otpService: OtpService) { }

  ngOnInit(): void {
    this.currentUser = this.dataService.currentUser;
    this.setPhoneNumber(this.currentUser.phone_number);
  }

  setPhoneNumber(phone: string) {
    const start = phone.length - 4;
    this.lastDigit = phone.slice(start, phone.length);
  }

  sendOtp() {
    const userData: any = {
      phone_number: this.currentUser.phone_number,
      first_name: this.currentUser.first_name
    };

    this.otpSent = true;
    this.otpService.createHashedOtp(userData).then(response => {
      this.otpService.setItem(response.otp);
    }).catch(error => {
      if (error.className === 'timeout') {
        this.alert.error('There was a connection timeout and this action could not be complated. Please try again!');
      } else {
        this.alert.error('An error occured.Please try again!');
      }

      this.otpSent = false;
      this.error = true;
    });
  }

  completeSetUp(form: NgForm) {
    if (form.valid) {
      this.submittingOtp = true;
      this.confirmOtp(this.otpForm).then(response => {
        this.submittingOtp = false;
        if (response) {
          return this.setTwoStepAuth();
        } else {
          this.alert.error('Wrong OTP provided!');
        }
      }).catch(error => {
        this.error = true;
        this.submittingOtp = false;
        this.alert.error('An error occured. Please try again!');
        this.dataService.logError(error);
      });
    }
  }

  setTwoStepAuth() {
    this.authService.setTwoStepAuth(this.currentUser).then(response => {
      this.currentUser = { ...response };
      this.alert.success('Two Step Authentication set up successfully');
      this.submittingOtp = false;
    }).catch(error => {
      this.submittingOtp = false;
      this.dataService.logError(error);
      this.alert.error('An error occured. Please try again!');
    });
  }

  async confirmOtp({ otp }) {
    const hashedOtp = await this.otpService.decryptOtp();
    return otp === hashedOtp.otp;
  }

}
