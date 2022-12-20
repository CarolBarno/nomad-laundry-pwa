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

  public getCurrentUser(): Promise<any> {
    return this.feathers.getCurrentUser();
  }

  public logIn(credentials?: any): Promise<any> {
    return this.feathers.authenticate(credentials);
  }

  public async logOut() {
    let l = await this.feathers.logout();
    if (!l) { return; }
    const currentUser = JSON.parse(localStorage.getItem('nomadLaundryCurrentUser'));
    if (!currentUser) { return; }
    this.clearLocalStorage();
    this.router.navigate(['accounts/login']);
  }

  clearLocalStorage() {
    this.getUserFromStorage().subscribe((user) => {
      if (user) {
        localStorage.removeItem('nomadLaundryCurrentUser');
        localStorage.removeItem('nomadLaundryAuth');
      }
    });
  }

  // gets stored auth key
  getStoredAuth() {
    return localStorage.getItem('nomadLaundryAuth');
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

  public login(credentials?: any) {
    return this.feathers.authenticate(credentials);
  }

  localStorageChanges(currentUser: any) {
    function changeState() {
      window.addEventListener('storage', (event) => {
        event.preventDefault();
        if (event.key === 'nomadLaundryCurrentUser') {
          if (event.oldValue !== event.newValue) {
            if (currentUser) {
              const { email, first_name, last_name } = currentUser;
              const user = { email, last_name, first_name };
              localStorage.setItem('nomadLaundryCurrentUser', JSON.stringify(user));
            }
          }
        }
      });
    }
    changeState();
  }

  getAuthUser(id: number): Promise<any> {
    return this.feathers.service('users').get(id, {
      query: { $select: ['two_step_auth_set', 'two_step_auth_status'] }
    });
  }

  connectionStatus(): boolean {
    return this.feathers.checkServerStatus();
  }

  resendEmailVerification(email): Observable<any> {
    const data: object = {
      action: 'resendVerifySignup',
      value: { email }
    };
    return <any>this.feathers.service('authManagement').watch().create(data);
  }

  setTwoStepAuth(user: any): Promise<any> {
    if (!user.id) return;
    return this.feathers.service('users').patch(user.id, { action: 'userSetTwoStepAuth' });
  }
}
