import { Injectable } from '@angular/core';
import { FeathersService } from './feathers.service';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor(private feathers: FeathersService) { }

  async userInputVerification(userInput: any) {
    let response = await this.feathers.service('users').create(userInput).then((res: any) => res).catch((error: any) => error);
    let isTaken;
    if (response.taken === false) {
      isTaken = false;
    } else {
      isTaken = response.data.taken;
    }
    return isTaken ? true : false;
  }

  async emailRegistered(userInput: any) {
    let response = await this.feathers.service('users').create(userInput).then((res: any) => res).catch((error: any) => error);

    let isTaken;
    if (response.taken === false) {
      isTaken = false;
    } else {
      isTaken = response.data.taken;
    }
    if (isTaken !== undefined) {
      return isTaken ? true : false;
    } else {
      return true;
    }
  }

  async isEmailRegistered(email: string) {
    if (!email) return true;
    return await this.emailRegistered({ email, action: 'AsyncValidator' });
  }

  async isEmailTaken(email: any) {
    return await this.userInputVerification({ email, action: 'AsyncValidator' });
  }

  async checkPhone(userInput: number) {
    return await this.userInputVerification({ phone_number: userInput, action: 'AsyncValidator' });
  }

  async checkIdNumber(id: number) {
    return await this.userInputVerification({ id_number: id, action: 'AsyncValidator' });
  }
}
