import { Injectable } from '@angular/core';
import feathers from '@feathersjs/feathers';
import feathersSocketIOClient from '@feathersjs/socketio-client';
import * as feathersRx from "feathers-reactive";
import * as io from "socket.io-client";
import { Observable } from 'rxjs';
import { environment } from "../../environments/environment";



@Injectable({ providedIn: 'root' })
export class FeathersService {
  private _feathers: any = feathers();
  private _socket = io(environment.apiUrl);
  private feathersAuthClient = require("@feathersjs/authentication-client").default;

  constructor() {
    this._feathers.configure(feathersSocketIOClient(this._socket, { timeout: 10000 }))
      .configure(this.feathersAuthClient({
        storage: window.localStorage,
        storageKey: "nomadLaundryAuth"
      }))
      .configure(feathersRx({
        idField: 'id'
      }));
  }

  public socket() {
    return this._socket;
  }

  public service(name: string) {
    return this._feathers.service(name);
  }


  public authenticate(credentials?: any): Promise<any> {
    return this._feathers.authenticate(credentials);
  }

  reAuthenticate(credentials?: any): Promise<any> {
    return this._feathers.reAuthenticate(true);
  }


  // logout

  public getCurrentUser(): Promise<any> {
    return this._feathers.get('authentication');
  }


  // Observable current user
  user(): Observable<any> {
    return this._feathers.get('authentication');
  }

  public logout(): Promise<any> {
    return this._feathers.logout();
  }


  disconnectServer() {
    console.log(this._feathers.channel);
    // this._feathers.authentication.logout()
  }

  checkServerStatus(): boolean {
    let status = this._socket.connect();
    return status.connected;
  }

  getConnectedUsers() {
    let v = this._feathers.service('users')
    v.on('connected', (a: any, v: any) => {
      console.log(a || v);
    })
    // console.log(v);

    return this._socket
    // return this._feathers.channel('authenticated', 'anonymous').connections;
  }


  isAuthenticated() {
    return this._feathers.authentication.authenticated;
  }

}

