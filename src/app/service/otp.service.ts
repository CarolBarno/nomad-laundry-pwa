import { Injectable } from '@angular/core';
import { userData } from '../interface/user-data';
import { FeathersService } from './feathers.service';

@Injectable({
  providedIn: 'root'
})
export class OtpService {

  constructor(private feathers: FeathersService) { }

  generateOtp(): number {
    let otp = 1000 + Math.floor(Math.random() * 9000);
    return otp;
  }

  setItem(value: any) {
    return sessionStorage.setItem('otp', value);
  }

  getItem() {
    return sessionStorage.getItem('otp');
  }

  createHashedOtp(userData: userData): Promise<any> {
    let api = this.feathers.service('otp');
    return api.create(userData);
  }

  decryptOtp(): Promise<any> {
    let api = this.feathers.service('otp');
    let otp = this.getItem();
    if (!otp) return null!;
    return api.get(otp);
  }

  clearSession() {
    return sessionStorage.clear();
  }
}
