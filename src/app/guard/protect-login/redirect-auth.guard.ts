import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RedirectAuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) { }
  canActivate(
    _next: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.checkLocalStorageDetials()) {
      return this.authService.logIn().then(_ => {
        this.router.navigate(['/']);
        return false;
      });
    } else {
      return true;
    }
  }

  checkLocalStorageDetials() {
    return this.authService.getStoredAuth();
  }

}
