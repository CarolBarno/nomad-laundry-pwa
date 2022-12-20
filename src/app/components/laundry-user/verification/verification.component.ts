import { Component, OnInit } from '@angular/core';
import { CurrentUser } from 'src/app/interface/user-interface';
import { AlertService } from 'src/app/service/alert.service';
import { AuthService } from 'src/app/service/auth.service';
import { DataService } from 'src/app/service/data.service';

@Component({
  selector: 'app-verification',
  templateUrl: './verification.component.html',
  styleUrls: ['./verification.component.css']
})
export class VerificationComponent implements OnInit {

  sendingEmail: boolean;
  emailSent: boolean = false;
  verifications: any;
  resendVerification: boolean;
  currentUser: CurrentUser;
  error: string;
  accountStatus: string;
  status: number = 0;

  constructor(private alert: AlertService, private dataService: DataService, private auth: AuthService) { }

  ngOnInit(): void {
    this.updateUi();
    this.currentUser = this.dataService.currentUser;
    this.getUser();
    this.computeAccountStatus(this.currentUser);
  }

  sendVerification() {
    this.sendingEmail = true;
    this.emailSent = true;
    this.auth.resendEmailVerification(this.currentUser.email).subscribe({
      next: res => {
        this.sendingEmail = false;
        this.verifications.email = true;
        this.alert.success('Verification link sent');
      },
      error: error => {
        this.dataService.logError(error);
        this.alert.error('An error occured. Please try again later');
      }
    });

    setTimeout(() => {
      this.resendVerification = true;
    }, 2000);
  }

  resendVerificationEmail() {
    this.sendVerification();
  }

  updateUi() {
    const verification = {
      email: false,
      id: true
    };

    this.verifications = verification;
  }

  checkTokenExpiry(date: number) {
    const currentTime: number = Date.now();

    if (date) {
      return date > currentTime;
    } else {
      return false;
    }
  }

  getUser() {
    this.dataService.getUser(this.currentUser.id).subscribe({
      next: res => {
        this.currentUser = res;
        this.computeAccountStatus(this.currentUser);
      },
      error: error => {
        this.dataService.logError(error);
      }
    });
  }

  computeAccountStatus(user) {
    const score = 100;
    const total = 2;
    let currentScore = 0;
    const benchMark = {
      isVerified: false,
      id_upload: false
    };

    for (let i in benchMark) {
      if (user[i]) currentScore += 1;
    }

    let percentage = Math.floor((currentScore / total) * 100);
    this.status = percentage;
    if (percentage < 50) {
      this.accountStatus = 'Not Verified';
    } else if (percentage >= 50 && percentage < 100) {
      this.accountStatus = 'You are almost there';
    } else if (percentage === 100) {
      this.accountStatus = 'Account fully verified';
    }
  }

}
