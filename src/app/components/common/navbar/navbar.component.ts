import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CurrentUser } from 'src/app/interface/user-interface';
import { AuthService } from 'src/app/service/auth.service';
import { DataService } from 'src/app/service/data.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  destroyAuth: Subject<any> = new Subject();
  currentUser: CurrentUser | any;

  constructor(private authService: AuthService, private dataService: DataService) {
    this.getCurrentUser();
  }

  ngOnInit(): void {
    this.authService.localStorageChanges(this.runningCurrentUser);
  }

  getCurrentUser() {
    this.authService.getUserFromStorage().pipe(takeUntil(this.destroyAuth)).subscribe({
      next: (user) => {
        this.currentUser = user;
        if (user) {
          this.authService.login().then(({ user }) => {
            this.currentUser = user;
            this.dataService.currentUser = user;
          }).catch((error) => {
            if (error.code === 401) {
              this.authService.clearLocalStorage();
              this.currentUser = null;
            }
          });
        }
      },
      error: (error) => {
        this.dataService.logError(error);
      }
    });
  }

  get runningCurrentUser() {
    return this.currentUser;
  }

  logout(): void {
    this.authService.logOut();
  }

  ngOnDestroy() {
    this.destroyAuth.next();
    this.destroyAuth.complete();
  }
}
