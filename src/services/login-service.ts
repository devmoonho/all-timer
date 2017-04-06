import { Injectable } from '@angular/core';

import { Globals } from '../app/globals';

// utils
import firebase from 'firebase';
import { Storage } from '@ionic/storage';

import * as moment from 'moment';

@Injectable()
export class LoginService {
  public fireAuth: any;
  public fireDatabase: any;

  constructor(
    private globals: Globals,
    private storage: Storage
  ) {
    this.fireAuth = firebase.auth();
    this.fireDatabase = firebase.database();
  }

  public serviceSuccessLogin(){
    return Promise.resolve()
    .then(() =>{
      return this.saveLoginInfoToLocal();
    })
    .then(() =>{
      return this.saveLoginInfoToServer();
    })
    .then(() => {
      console.log("---- serviceSuccessLogin done ----");
    })
  }

  public serviceSuccessCreateUser({email, password}){
    return Promise.resolve()
    .then(() =>{
      return this.loginEmail({email, password});
    })
    .then(() =>{
      return this.saveLoginInfoToLocal();
    })
    .then(() =>{
      return this.saveLoginInfoToServer();
    })
    .then(() => {
      console.log("---- serviceSuccessCreateUser done ----");
    })
  }

  public serviceLoginUser({email, password}): any{
    return Promise.resolve()
    .then(() =>{
      return this.loginEmail({email, password});
    })
    .then(() => {
      console.log("---- serviceLoginUser done ----");
    })
  }

  public serviceSignup({email, name, password}): any {
    return Promise.resolve()
    .then(() => {
      return this.createUser({email, password});
    })
    .then(() => {
      return this.saveUserInfo({name, email});
    })
    .then(() => {
      console.log(" ---- serviceSignup done ----");
    });
  }

  private createUser({email, password}){
      return this.fireAuth.createUserWithEmailAndPassword(email, password);
  }

  private saveUserInfo({name, email}){
    let user = this.fireAuth.currentUser;
    return this.fireDatabase.ref(this.globals.USERS + user.uid).set({
      username: name,
      email: email
    });
  }

  private loginEmail({email, password}): any{
      return this.fireAuth.signInWithEmailAndPassword(email, password);
  }

  private saveLoginInfoToLocal(): any {
    let user = this.fireAuth.currentUser;
    return this.storage.set('UserInfo', user);
  }

  private saveLoginInfoToServer(): any {
    let user = this.fireAuth.currentUser;

    return this.fireDatabase.ref(this.globals.USERS + user.uid ).update({
      lastConnect: moment().format('YYYYMMDDHHmmss')
    });
  }
}
