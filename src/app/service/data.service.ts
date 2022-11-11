import { Injectable } from '@angular/core';
import { Paginated } from '@feathersjs/feathers';
import { Observable, of } from 'rxjs';
import { catchError, map, retry, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { CurrentUser } from '../interface/user-interface';
import { AlertService } from './alert.service';
import { FeathersService } from './feathers.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  currentUser: CurrentUser | any;
  userRoles: any;
  public authUser: CurrentUser | any;
  constructor(private feathers: FeathersService, private alert: AlertService) { }

  logError(error: Error) {
    if (!environment.production) {
      console.log(error);
    }
  }

  getUserPermissions(query?: any): Observable<any[]> {
    return this.feathers.service('laundry-permission').watch().find({
      query: {
        $limit: 100000,
        currentUserRequest: true,
        ...query
      }
    }).pipe(
      map((response: Paginated<any>) => response.data),
      retry(2)
    );
  }

  getServerTime(): Promise<any> {
    return <any>this.feathers.service('server-current-time').get(1);
  }

  sendEmail(data: any, message?: string): Observable<any> {
    return this.feathers.service('email').watch().create(data)
      .pipe(
        tap((_) => this.alert.success(`${message ? message : 'Email'} sent`)),
        catchError(this.handleError<any>('Resending email'))
      );
  }

  getSiteSettings(): Observable<any> {
    return this.feathers.service('site-settings').watch().find({
      query: {
        $limit: 1,
        is_host: true
      }
    }).pipe(map((resposne: Paginated<any>) => resposne.data));
  }

  private handleError<T>(operarion = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.log(error);
      console.log(`${operarion} failed: ${error.message}`);
      this.alert.error(`${operarion} failed: ${this.formatErrorDisplay(error)}`)
      return of(result as T);
    };
  }

  formatErrorDisplay(error: any) {
    let message;
    if (Array.isArray(error.errors || {})) {
      message = error.errors.map((e: any) => e.message).join('\n');
    } else {
      message = error.message;
    }

    return message;
  }
}
