import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgForm, NgModel } from '@angular/forms';
import { Router } from '@angular/router';
import { CurrentUser } from 'src/app/interface/user-interface';
import { AlertService } from 'src/app/service/alert.service';
import { AuthService } from 'src/app/service/auth.service';
import { DataService } from 'src/app/service/data.service';
import { Criteria } from '../../common/register/register.component';

@Component({
  selector: 'app-admin-password-change',
  templateUrl: './admin-password-change.component.html',
  styleUrls: ['./admin-password-change.component.css', '../change-password/change-password.component.css', '../user-styles/user-styles.shared.css']
})
export class AdminPasswordChangeComponent implements OnInit, OnDestroy {
  @Input() currentUser: CurrentUser
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
    action: 'validUserChangePasword'
  };
  criteriaMap = new Map<Criteria, RegExp>();
  containAtLeastEightChars: boolean;
  containAtLeastOneLowerCaseLetter: boolean;
  containAtLeastOneUpperCaseLetter: boolean;
  containAtLeastOneDigit: boolean;
  containAtLeastOneSpecialChar: boolean;
  containUserNames: boolean;
  containCompanyNames: boolean;
  timer: NodeJS.Timer;

  constructor(private authService: AuthService, private dataService: DataService, private alert: AlertService,
    private router: Router) {
    this.criteriaMap.set(Criteria.at_least_five_chars, RegExp(/^.{8,30}$/));
    this.criteriaMap.set(Criteria.at_least_one_lowercase_char, RegExp(/^(?=.*?[a-z])/));
    this.criteriaMap.set(Criteria.at_least_one_uppercase_char, RegExp(/^(?=.*?[A-Z])/));
    this.criteriaMap.set(Criteria.at_least_one_digit_char, RegExp(/^(?=.*?[0-9])/));
    this.criteriaMap.set(Criteria.at_least_one_special_char, RegExp(/^(?=.*?[" !"#$%&'()*+,-./:;<=>?@[\]^_`{|}~"])/));
  }

  ngOnInit(): void {
  }

  private _containAtLeastEightChars(): boolean {
    this.containAtLeastEightChars = this.criteriaMap.get(Criteria.at_least_five_chars).test(this.userPassword.new_password);
    return this.containAtLeastEightChars;
  }

  private _containAtLeastOneLowerCaseLetter(passwordInp: NgModel): boolean {
    this.containAtLeastOneLowerCaseLetter = this.criteriaMap.get(Criteria.at_least_one_lowercase_char).test(this.userPassword.new_password);
    if (!this.containAtLeastOneLowerCaseLetter) {
      passwordInp.control.setErrors({ case: true });
    }
    return this.containAtLeastOneLowerCaseLetter;
  }

  private _containAtLeastOneUpperCaseLetter(passwordInp: NgModel): boolean {
    this.containAtLeastOneUpperCaseLetter = this.criteriaMap.get(Criteria.at_least_one_uppercase_char).test(this.userPassword.new_password);
    if (!this.containAtLeastOneUpperCaseLetter) {
      passwordInp.control.setErrors({ case: true });
    }
    return this.containAtLeastOneUpperCaseLetter;
  }

  private _containAtLeastOneDigit(passwordInp: NgModel): boolean {
    this.containAtLeastOneDigit = this.criteriaMap.get(Criteria.at_least_one_digit_char).test(this.userPassword.new_password);
    if (!this.containAtLeastOneDigit) {
      passwordInp.control.setErrors({ digit: true });
    }
    return this.containAtLeastOneDigit;
  }

  private _containAtLeastOneSpecialChar(passwordInp: NgModel): boolean {
    this.containAtLeastOneSpecialChar = this.criteriaMap.get(Criteria.at_least_one_special_char).test(this.userPassword.new_password);
    if (!this.containAtLeastOneSpecialChar) {
      passwordInp.control.setErrors({ special: true });
    }
    return this.containAtLeastOneSpecialChar;
  }

  private _containUserName(passwordInp: NgModel): boolean {
    var { first_name, last_name } = this.currentUser;
    first_name = first_name.toLowerCase();
    last_name = last_name.toLowerCase();
    let passName = this.userPassword.new_password.toLowerCase();
    this.containUserNames = passName.includes(first_name) || passName.includes(last_name);
    if (this.containUserNames) {
      passwordInp.control.setErrors({ userNames: true });
    }
    return this.containUserNames;
  }

  private _containCompanyName(passwordInp: NgModel): boolean {
    let compName = 'nomadlaundry', compAbv = 'nl';
    let passName = this.userPassword.new_password.toLowerCase();
    this.containCompanyNames = passName.includes(compName) || passName.includes(compAbv);
    if (this.containCompanyNames) {
      passwordInp.control.setErrors({ compName: true });
    }
    return this.containCompanyNames;
  }


  //pasword stregth
  checkPassword(passInput: NgModel): void {
    if (!this.userPassword.new_password) {
      return;
    }
    this.calculatePasswordStrength(passInput);
  }

  calculatePasswordStrength(passwordInp: NgModel) {
    this._containAtLeastEightChars();
    this._containAtLeastOneDigit(passwordInp);
    this._containAtLeastOneSpecialChar(passwordInp);
    this._containAtLeastOneUpperCaseLetter(passwordInp);
    this._containAtLeastOneLowerCaseLetter(passwordInp);
    this._containUserName(passwordInp);
    this._containCompanyName(passwordInp);
  }

  clearDefaults(): void {
    this.containAtLeastEightChars = undefined;
    this.containAtLeastOneLowerCaseLetter = undefined;
    this.containAtLeastOneUpperCaseLetter = undefined;
    this.containAtLeastOneDigit = undefined;
    this.containAtLeastOneSpecialChar = undefined;
    this.containUserNames = undefined;
    this.containCompanyNames = undefined;
  }


  confirmPasswordMatch({ new_password, confirm_password }): boolean {
    if (Object.is(new_password, confirm_password)) {
      return true;
    } else {
      return false;
    }
  };


  // submit data
  changePassword(form: NgForm) {
    if (form.valid) {
      //check connection status
      if (!this.authService.connectionStatus()) {
        //throw error
        this.alert.warning('A system failure or your internet is unavailable or slow internet connection, Check your connection and try again.', 'Password change');
        return;
      }
      if (this.confirmPasswordMatch(this.userPassword)) {
        this.loader = true;
        this.error = false;
        this.submitData(this.userPassword, form);
        //submit data
      } else {
        this.error = true;
        this.loader = false;
        this.errorMessage = 'Password fields do not match';
      }
    }
  }

  submitData(userPassword: any, form: NgForm) {
    //make sure user is authenticated
    this.authService.logIn().then(
      ({ user }) => {
        return this.dataService.changePassword(userPassword, user.id).subscribe(
          {
            next: () => {
              this.alert.success('Password changed successfully');
              this.loader = false;
              form.resetForm();
              this.clearDefaults();
              this.timer = setTimeout(() => {
                this.router.navigate([`/profile/${this.currentUser.first_name + "-" + this.currentUser.last_name}`]);
              }, 450);

            },
            error: error => {
              if (error.code === 408) {
                this.alert.error('Your connection to the server has timed-out. Please try again', 'Network timeout');
              } else {
                this.alert.error(error.message);
                this.loader = false;
              }
            }
          }
        );
      }
    ).catch(
      error => {
        this.loader = false;
        this.alert.error('The password you provided is incorrect');
      }
    )
  }


  ngOnDestroy() {
    clearTimeout(this.timer);
  }

}
