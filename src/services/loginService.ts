import { Injectable } from '@angular/core';

import firebase from 'firebase';

@Injectable()
export class LoginService {
  public fireAuth: any;

  constructor() {
    this.fireAuth = firebase.auth();
  }

  getCurrentUser(): any{
    return this.fireAuth.currentUser;
  }

  signInWithEmailAndPassword({email, password}): any{
      console.log(email, password);
  }

  createUserWithEmailAndPassword({name, email, password}): any{
      console.log(name, email, password);
  }
}
