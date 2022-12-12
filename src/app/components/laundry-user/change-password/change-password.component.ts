import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { CurrentUser } from 'src/app/interface/user-interface';
import { AlertService } from 'src/app/service/alert.service';
import { AuthService } from 'src/app/service/auth.service';
import { DataService } from 'src/app/service/data.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css', '../user-styles/user-styles.shared.css']
})
export class ChangePasswordComponent implements OnInit, OnDestroy {
  loader: boolean;
  error: boolean;
  errorMessage: string;
  hide: boolean = true;
  hideMain: boolean = true;
  hideConfirm: boolean = true;
  userPassword: any = {
    current_password: null,
    new_password: null,
    confirm_password: null,
    action: 'validUserChangePassword'
  };
  currentUser: CurrentUser;
  enforceAdminPassChange: boolean;
  timer: NodeJS.Timer;

  constructor(private authService: AuthService, private router: Router, private alert: AlertService,
    private dataService: DataService) { }

  ngOnInit(): void {
    this.currentUser = this.dataService.currentUser;
    this.getUserType(this.currentUser);
  }

  confirmPasswordMatch({ new_password, confirm_password }): boolean {
    if (Object.is(new_password, confirm_password)) return true;
    return false;
  }

  changePassword(form: NgForm) {
    if (form.valid) {
      if (this.confirmPasswordMatch(this.userPassword)) {
        this.loader = true;
        this.error = false;
        this.submitData(this.userPassword);
      } else {
        this.error = true;
        this.loader = false;
        this.errorMessage = 'Password fields do not match';
      }
    }
  }

  submitData(userPassword: any) {
    this.authService.logIn().then(
      ({ user }) => {
        return this.dataService.changePassword(userPassword, user.id).subscribe({
          next: () => {
            this.alert.success('Password changed successfully');
            this.loader = false;
            this.timer = setTimeout(() => {
              this.router.navigate([`profile/${this.currentUser.first_name + '-' + this.currentUser.last_name}`]);
            }, 450);
          },
          error: error => {
            this.alert.error(error.message);
            this.loader = false;
          }
        });
      }
    ).catch(error => {
      this.loader = false;
      this.alert.error('Password provided is incorrect');
    });
  }

  async getUserType({ user_type }) {
    if (user_type === 0) this.enforceAdminPassChange = true;
    return user_type === 0;
  }

  ngOnDestroy(): void {
    clearTimeout(this.timer);
  }

}
