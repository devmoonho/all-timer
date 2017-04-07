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

  public serviceLogout(){
    return Promise.resolve()
    .then(()=>{
      return this.logout();
    })
    .then(()=>{
      console.log("---- serviceLogout done ----");
    })
  }

  public serviceResetPassword({email}){
    return Promise.resolve()
    .then(() => {
      return this.resetPassword({email});
    })
    .then(()=>{
      console.log("---- serviceResetPassword done ----");
    })
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

  public serviceLoginEmail({email, password}): any{
    return Promise.resolve()
    .then(() =>{
      return this.loginEmail({email, password});
    })
    // TODO I don't know user info need to be saved to local storage
    // .then(() =>{
    //   return this.saveLoginInfoToLocal();
    // })
    .then(() =>{
      return this.saveLoginInfoToServer();
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
    .then(() =>{
      return this.loginEmail({email, password});
    })
    // TODO I don't know user info need to be saved to local storage
    // .then(() =>{
    //   return this.saveLoginInfoToLocal();
    // })
    .then(() =>{
      return this.saveLoginInfoToServer();
    })
    .then(() => {
      console.log(" ---- serviceSignup done ----");
    });
  }

  private logout(): any{
    return this.fireAuth.signOut();
  }

  private resetPassword({email}): any{
    return this.fireAuth.sendPasswordResetEmail(email);
  }

  private createUser({email, password}): any{
      return this.fireAuth.createUserWithEmailAndPassword(email, password);
  }

  private saveUserInfo({name, email}): any{
    let user = this.fireAuth.currentUser;
    return this.fireDatabase.ref(this.globals.SERVER_PATH_USERS + user.uid + this.globals.SERVER_PATH_USER_PROFILE).set({
      username: name,
      email: email
    });
  }

  private loginEmail({email, password}): any{
      return this.fireAuth.signInWithEmailAndPassword(email, password);
  }

  private saveLoginInfoToLocal(): any {
    let user = this.fireAuth.currentUser;
    return this.storage.set(this.globals.LOCAL_STORAGE_KEY_USER_INFO, user);
  }

  private saveLoginInfoToServer(): any {
    let user = this.fireAuth.currentUser;

    return this.fireDatabase.ref(this.globals.SERVER_PATH_USERS + user.uid + this.globals.SERVER_PATH_USER_PROFILE).update({
      lastConnect: moment().format('YYYYMMDDHHmmss')
    });
  }
}
