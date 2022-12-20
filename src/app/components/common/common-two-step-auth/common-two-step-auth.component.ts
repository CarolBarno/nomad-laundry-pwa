import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CurrentUser } from 'src/app/interface/user-interface';
import { AuthService } from 'src/app/service/auth.service';
import { OtpService } from 'src/app/service/otp.service';

@Component({
  selector: 'app-common-two-step-auth',
  templateUrl: './common-two-step-auth.component.html',
  styleUrls: ['./common-two-step-auth.component.css']
})
export class CommonTwoStepAuthComponent implements OnInit, AfterViewInit {

  @ViewChild('firstInp', { static: false }) firstInp: ElementRef;
  @ViewChild('secondInp', { static: false }) secondInp: ElementRef;
  @ViewChild('thirdInp', { static: false }) thirdInp: ElementRef;
  @ViewChild('fourthInp', { static: false }) fourthInp: ElementRef;

  timeLimit = 120;
  timer: NodeJS.Timer;
  resendStatus = true;
  otpExpired = false;
  authUser: any;
  errorMessage: string;
  error: boolean;
  success: boolean;
  submittingOtp: boolean;
  otpFormData = {
    first: null,
    second: null,
    third: null,
    fourth: null
  };
  redirectTo: any;

  constructor(private otpService: OtpService, private authService: AuthService, private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.getUserDetails();
    this.redirectTo = this.route.snapshot.queryParams['redirectTo'] || '/';
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.firstInp.nativeElement.focus();
    }, 500);
  }

  getUserDetails() {
    this.authService.logIn().then(res => {
      this.authUser = res.user;
      this.getOtp();
    });
  }

  focusNext(event: any, inputId: string) {
    const pattern = /\d/;
    if (event.code !== 'Backspace' && pattern.test(event.code)) {
      switch (inputId) {
        case 'first':
          this.secondInp.nativeElement.focus();
          break;
        case 'second':
          this.thirdInp.nativeElement.focus();
          break;
        case 'third':
          this.fourthInp.nativeElement.focus();
          break;
      }
    }

    if (event.code === 'Backspace') {
      switch (inputId) {
        case 'second':
          this.firstInp.nativeElement.focus();
          break;
        case 'third':
          this.secondInp.nativeElement.focus();
          break;
        case 'fourth':
          this.thirdInp.nativeElement.focus();
          break;
      }
    }
  }

  simulateOtpExpiry() {
    this.timer = setInterval(() => { this.calculateSeconds(); }, 1000);
  }

  calculateSeconds() {
    if (this.timeLimit > 0) {
      this.timeLimit -= 1;

      if (this.timeLimit <= 10) {
        this.resendStatus = false;
      }
    } else {
      this.otpExpired = true;
      clearInterval(this.timer);
      this.otpService.setItem(null);
    }
  }

  resendOtp() {
    this.resendStatus = true;
    this.otpExpired = false;
    this.timeLimit = this.timeLimit + 120;
    clearInterval(this.timer);
    this.getOtp();
  }

  getOtp() {
    const userData = { ...this.authUser };

    this.otpService.createHashedOtp(userData).then(res => {
      this.otpService.setItem(res.otp);
      this.simulateOtpExpiry();
    }).catch(error => {
      this.error = true;
      if (error.class === 'timeout') {
        this.errorMessage = 'There was a connection timeout and this action could not be complated. Please try again!';
      } else {
        this.errorMessage = 'An error occured. Please try again!';
      }
    });
  }

  submitOtp(form: NgForm) {
    if (form.valid) {
      this.submittingOtp = true;
      const fullOtp = `${this.otpFormData.first}${this.otpFormData.second}${this.otpFormData.third}${this.otpFormData.fourth}`.trim();
      this.confirmOtp({ otp: fullOtp }).then(res => {
        this.submittingOtp = false;
        if (res) {
          return this.updateUserAuth();
        } else {
          this.error = true;
          this.errorMessage = 'Wrong OTP. Try again!';
        }
      }).catch(error => {
        this.error = true;
        this.submittingOtp = false;
        this.errorMessage = 'An error occured. Please try again!';
      });
    }
  }

  updateUserAuth() {
    this.authService.completeUserSignIn(this.authUser).then(response => {
      this.saveUserDetails(response);
      const userCheck = this.authService.checkUserType({ user: response });
      if (userCheck) {
        this.router.navigate(['/admin']);
      } else {
        this.router.navigateByUrl(this.redirectTo);
      }
    }).catch(error => {
      this.error = true;
      this.errorMessage = error.message;
      this.submittingOtp = false;
    });
  }

  async confirmOtp({ otp }) {
    const hashedOtp = await this.otpService.decryptOtp();
    return otp === hashedOtp.otp;
  }

  saveUserDetails(user: CurrentUser) {
    const { email, first_name, last_name } = user;
    const currentUser = { email, first_name, last_name };

    localStorage.setItem('nomadLaundryCurrentUser', JSON.stringify(currentUser));
  }

  cancelLogin() {
    const ok = confirm('Are you sure you want to cancel login? You will be signed out');
    if (!ok) return;

    this.authService.logOut().then(res => {
      this.router.navigate(['/']);
    });
  }

}
