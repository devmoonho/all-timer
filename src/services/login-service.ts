import { Injectable } from '@angular/core';

import { Globals } from '../app/globals';


// utils
import firebase from 'firebase';
import { Storage } from '@ionic/storage';

import * as moment from 'moment';

//Oauth
import { GooglePlus } from '@ionic-native/google-plus';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { TwitterConnect } from '@ionic-native/twitter-connect';

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

  public serviceTwitterLogin(): any{
    return Promise.resolve()
    .then(()=>{
      return this.twitterLogin();
    })
    .then((res)=>{
      console.log(res);
      return this.firebaseTwitterCredentialLogin(res);
    })
    .then(() => {
      return this.saveUserInfoToServer();
    })
    .then(() =>{
      return this.saveLoginInfoToLocal();
    })
    .then(() =>{
      return this.saveLoginInfoToServer();
    })
    .then(()=>{
      console.log("---- serviceTwitterLogin done ----");
    })
  }

  public serviceFacebookLogin(): any{
    return Promise.resolve()
    .then(()=>{
      return this.facebookLogin();
    })
    .then((res)=>{
      console.log(res);
      return this.firebaseFacebookCredentialLogin(res);
    })
    .then(() => {
      return this.saveUserInfoToServer();
    })
    .then(() =>{
      return this.saveLoginInfoToLocal();
    })
    .then(() =>{
      return this.saveLoginInfoToServer();
    })
    .then(()=>{
      console.log("---- serviceFacebookLogin done ----");
    })
  }

  public serviceGooglePlusLogin(): any{
    return Promise.resolve()
    .then(()=>{
      return this.googlePluselogin();
    })
    .then((res) =>{
      return this.firebaseGoogleCredentialLogin(res);
    })
    .then(() => {
      return this.saveUserInfoToServer();
    })
    .then(() =>{
      return this.saveLoginInfoToLocal();
    })
    .then(() =>{
      return this.saveLoginInfoToServer();
    })
    .then(()=>{
      console.log("---- serviceGoogleLogin done ----");
    })
  }

  public serviceLogout(): any{
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

  public serviceLoginEmail({email, password}): any{
    return Promise.resolve()
    .then(() =>{
      return this.loginEmail({email, password});
    })
    // TODO I don't know user info need to be saved to local storage
    .then(() =>{
      return this.saveLoginInfoToLocal();
    })
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
    .then(() =>{
      return this.updateUserProfile({profile:{displayName:name}});
    })
    .then(() => {
      return this.saveUserInfoToServer();
    })
    .then(() =>{
      return this.loginEmail({email, password});
    })
    // TODO I don't know user info need to be saved to local storage
    .then(() =>{
      return this.saveLoginInfoToLocal();
    })
    .then(() =>{
      return this.saveLoginInfoToServer();
    })
    .then(() => {
      console.log(" ---- serviceSignup done ----");
    });
  }

  private firebaseTwitterCredentialLogin(res: any): any{
    let credential = firebase.auth.TwitterAuthProvider.credential(res.token, res.secret);
    return this.fireAuth.signInWithCredential(credential)
  }

  private twitterLogin():any{
    return TwitterConnect.prototype.login();
  }

  private firebaseFacebookCredentialLogin(res: any): any{
    let credential = firebase.auth.FacebookAuthProvider.credential(res.authResponse.accessToken);
    return this.fireAuth.signInWithCredential(credential)
  }

  private facebookLogin():any{
    return Facebook.prototype.login(
      ["public_profile", "email"]
    )
  }

  private firebaseGoogleCredentialLogin(res: any):any{
      let credential:any = firebase.auth.GoogleAuthProvider.credential(res.idToken);
      return this.fireAuth.signInWithCredential(credential);
  }

  private googlePluselogin():any{
    return GooglePlus.prototype.login({
      'webClientId': this.globals.WEB_CLINED_ID
    })
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

  private updateUserProfile({profile}): any{
    let user = this.fireAuth.currentUser;
    return user.updateProfile({
      displayName:profile.displayName
    });
  }

  private saveUserInfoToServer(): any{
    let user = this.fireAuth.currentUser;
    return this.fireDatabase.ref(this.globals.SERVER_PATH_USERS + user.uid + this.globals.SERVER_PATH_USER_PROFILE).set({
      username: user.displayName,
      email: user.email
    });
  }

  private loginEmail({email, password}): any{
      return this.fireAuth.signInWithEmailAndPassword(email, password);
  }

  private saveLoginInfoToLocal(): any {
    let user = this.fireAuth.currentUser;
    return this.storage.set(this.globals.LOCAL_STORAGE_KEY_USER_INFO, JSON.stringify(user));
  }

  private saveLoginInfoToServer(): any {
    let user = this.fireAuth.currentUser;

    return this.fireDatabase.ref(this.globals.SERVER_PATH_USERS + user.uid + this.globals.SERVER_PATH_USER_PROFILE).update({
      lastConnect: moment().format('YYYYMMDDHHmmss')
    });
  }
}
