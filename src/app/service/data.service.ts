import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CurrentUser } from '../interface/user-interface';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  currentUser: CurrentUser | any;
  constructor() { }

  logError(error: Error) {
    if (!environment.production) {
      console.log(error);
    }
  }
}
