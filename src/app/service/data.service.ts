import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor() { }

  logError(error: Error) {
    if (!environment.production) {
      console.log(error);
    }
  }
}
