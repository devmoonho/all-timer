import { Injectable } from '@angular/core';

import { Globals } from '../app/globals';

// utils
import firebase from 'firebase';

@Injectable()
export class LoginService {
  public fireAuth: any;
  public fireDatabase: any;

  constructor( private globals: Globals ) {
    this.fireAuth = firebase.auth();
    this.fireDatabase = firebase.database();
  }

  createUser({email, password}){
      return this.fireAuth.createUserWithEmailAndPassword(email, password);
  }

  saveUserInfo({name, email}){
    let user = this.fireAuth.currentUser;
    return this.fireDatabase.ref(this.globals.USERS + user.uid).set({
      username: name,
      email: email
    });
  }

  serviceSignup({email, name, password}): any {
    return Promise.resolve()
        .then(() => {
            return this.createUser({email, password});
        })
        .then(() => {
            return this.saveUserInfo({name, email});
        })
        .then(function() {
            console.log(" ---- done ----");
        });
  }
}
