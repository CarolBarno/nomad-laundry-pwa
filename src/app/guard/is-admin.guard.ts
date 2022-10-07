import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class IsAdminGuard implements CanActivate {

  constructor(private router: Router, private authService: AuthService) { }
  canActivate(
    _next: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    return this.authService.logIn().then(
      userData => {
        const { user } = userData;
        if (user.user_type === 0) {
          return true;
        }
        else {
          this.router.navigate(['/'])
          return false
        }
      }
    ).catch(
      error => {
        this.router.navigate(['/']);
        return false
      }
    )

  }

}
