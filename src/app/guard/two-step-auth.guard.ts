import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class TwoStepAuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.checkLocalStorageDetails()) {
      return this.authService.logIn().then(async response => {
        const user = await this.authService.getAuthUser(response.id);
        if (user.two_step_auth_set) {
          if (user.two_step_auth_status) {
            return true;
          } else {
            this.navigateToVerification();
            return false;
          }
        } else {
          return true;
        }
      });
    } else {
      return true;
    }
  }

  checkLocalStorageDetails() {
    return this.authService.getStoredAuth();
  }

  navigateToVerification() {
    this.router.navigate(['/two-step-auth']);
  }

}
