import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { CurrentUser } from '../interface/user-interface';
import { FeathersService } from './feathers.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private feathers: FeathersService, private router: Router) { }

  // get authenticated user info
  getUserFromStorage(): Observable<CurrentUser | null> {
    try {
      const currentUser = localStorage.getItem('nomadLaundryCurrentUser');
      return of(currentUser ? JSON.parse(currentUser) : null);
    } catch (error) {
      return of(null);
    }

  }

  public async logOut() {
    let l = await this.feathers.logout();
    if (!l) { return; }
    const currentUser = localStorage.getItem('nomadLaundryCurrentUser');
    const client = currentUser ? JSON.parse(currentUser) : null;
    if (!client) { return; }
    this.clearLocalStorage();
    if (client.client) {
      const path = this.router.routerState.snapshot.url;
      this.router.navigate(['accounts/login'], { queryParams: { redirectTo: path } });

    } else {
      this.router.navigate(['accounts/login']);
    }
  }

  clearLocalStorage() {
    this.getUserFromStorage().subscribe((user) => {
      if (user) {
        localStorage.removeItem('nomadLaundryCurrentUser');
        localStorage.removeItem('nomadLaundryAuth');
      }
    });
  }

  // login authenitcations
  authenticate(credentials: { strategy: string; email: any; password: any; }): Promise<any> {
    return this.feathers.authenticate(credentials);
  }

  public checkUserType({ user }: any): boolean {
    if (user.user_type === 0) {
      return true;
    } else {
      return false;
    }
  }
}
