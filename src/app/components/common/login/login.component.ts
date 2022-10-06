import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CurrentUser } from 'src/app/interface/user-interface';
import { AuthService } from 'src/app/service/auth.service';
import { DataService } from 'src/app/service/data.service';

export interface Ilogin {
  email: string;
  password: any;
}

declare global {
  interface Window {
    PasswordCredential: any;
    FederatedCredential: any;
  }
}

declare global {
  interface Navigator {
    navigator: any;
  }
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  banner = '../../../../assets/image/home_image.png';
  messages: any;
  currentUser: any = [{}];
  redirectTo: string = '';
  loginSuccess: boolean | undefined;
  hide = true; // hide/show password
  loginData: Ilogin = {
    email: '',
    password: null,
  };
  logoutDevices: boolean | undefined;

  constructor(private dataService: DataService, private authService: AuthService, private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.authService.getUserFromStorage().subscribe({
      next: (user) => (user ? this.router.navigate(['']) : ''),
      error: (error) => this.dataService.logError(error),
    });

    this.redirectTo = this.route.snapshot.queryParams['redirectTo'] || '/';
  }


  saveUserDetails(user: CurrentUser) {
    // create new user object with only insensitive data like password
    const { email, first_name, last_name } = user;
    const currentUser = {
      email,
      first_name,
      last_name
    };
    localStorage.setItem(
      'nomadLaundryCurrentUser',
      JSON.stringify(currentUser)
    );
  }


  checkLocalStorage(): void {
    this.authService.getUserFromStorage().subscribe((user) => {
      if (user) {
        this.authService.logOut();
      }
    });
  }

  loginUser(form: NgForm) {
    if (!form.valid) {
      return;
    }
    // check for user in local storage
    this.checkLocalStorage();
    const email = form.value.email;
    const password = form.value.password;
    if (!email || !password) {
      this.messages = 'Incomplete credentials';
      return;
    }
    this.loginSuccess = true;
    // authenticate user
    this.authService.authenticate({ strategy: 'local', email, password }).then(
      (data) => {
        // save login details
        this.loginSuccess = false;
        this.saveUserDetails(data.user);

        const userCheck = this.authService.checkUserType(data);
        if (userCheck) {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigateByUrl(this.redirectTo);
        }

      },
      (error) => {

        this.logoutDevices = false;
        if (error.code === 401) {
          this.messages = `Invalid email or password provided. Kindly try again`;
        } else if (error.code === 408) {
          this.messages = 'An error occured please try again later or check your connection';
        } else if (error.code === 412) {
          this.logoutDevices = true;
          this.messages = error.message;
        } else if (error.code === 413) {
          this.messages = error.message;
        } else {
          this.messages = `It's not you!. It's Us, Contact us.`;
        }
        this.dataService.logError(error);
        this.loginSuccess = false;
      }
    );
  }

}

