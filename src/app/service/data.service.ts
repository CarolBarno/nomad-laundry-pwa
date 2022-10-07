import { Injectable } from '@angular/core';
import { Paginated } from '@feathersjs/feathers';
import { Observable } from 'rxjs';
import { map, retry } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { CurrentUser } from '../interface/user-interface';
import { FeathersService } from './feathers.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  currentUser: CurrentUser | any;
  userRoles: any;
  public authUser: CurrentUser | any;
  constructor(private feathers: FeathersService) { }

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
}
