import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AlertService } from '../service/alert.service';
import { AuthService } from '../service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class EnforceDefaultPasswordChangeGuard implements CanActivate {
  constructor(private authService: AuthService, private alertService: AlertService, private router: Router) { }

  canActivate(
    _next: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.authService.logIn().then(user => {
      const status = this.checkUser(user);
      if (status) {
        this.router.navigate(['/user/password-change']);
        this.alertService.info('Please Update your password.', 'Action required')
        return false
      } else {
        return true;
      }
    }).catch(e => {
      //user is not authenticated
      return true;
    })
  }

  // chek user
  checkUser(currentUser: any): boolean {
    if (!currentUser) {
      return false;
    } else if (currentUser.user.user_status !== 'P') {
      return false
    } else if (currentUser.user.user_status === 'P') {
      return true;
    } else {
      return false;
    }
  }

}
