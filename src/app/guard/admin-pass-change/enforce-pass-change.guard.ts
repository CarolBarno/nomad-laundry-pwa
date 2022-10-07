import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../../app/service/auth.service';
import { DataService } from '../../../app/service/data.service';

@Injectable({
  providedIn: 'root'
})
export class EnforcePassChangeGuard implements CanActivate {
  constructor(private auth: AuthService, private dataService: DataService, private router: Router) { }
  canActivate(
    _next: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.auth.logIn().then(
      async ({ user }) => {
        //check password expiry
        let serverTime = await this.getServerTime();
        let status = this.checkPasswordExpiry(user, serverTime);
        if (status) {
          return true;
        } else {
          this.router.navigate(['/profile/change-password'])
          return false;
        }
      }
    ).catch(
      e => false
    );
  }


  async getServerTime() {
    let serverTime = await this.dataService.getServerTime();
    return serverTime.currentTime;
  }

  checkPasswordExpiry({ password_expiry }: any, currentDate: string | number | Date): boolean {
    let passwordExpiry = new Date(password_expiry).getTime();
    currentDate = new Date(currentDate).getTime()
    return passwordExpiry > currentDate;
  }

}
