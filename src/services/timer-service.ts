import { Injectable } from '@angular/core';
import { Globals } from '../app/globals';

// utils
import firebase from 'firebase';
import { Storage } from '@ionic/storage';

import * as moment from 'moment';

@Injectable()
export class TimerService {
  public fireAuth: any;
  public fireDatabase: any;

  constructor(
    private globals: Globals,
    private storage: Storage
  ) {
    this.fireAuth = firebase.auth();
    this.fireDatabase = firebase.database();
  }

  public serviceTimerData(): any{
    return Promise.resolve()
    .then(()=>{
      return this.loadTimerDataFromServer();
    })
    .then(()=>{
      console.log("---- serviceTimerData done ----");
    })
  }

  public serviceTimerTemplateData(): any{
    return Promise.resolve()
    .then(()=>{
      return this.loadTimerTemplateDataFromServer();
    })
    .then(()=>{
      console.log("---- serviceTimerTemplateData done ----");
    })
  }

  public serviceTimerCategoryData(): any{
    return Promise.resolve()
    .then(()=>{
      return this.loadCategoryDataFromServer();
    })
    .then(()=>{
      console.log("---- serviceLoadCategoryData done ----");
    })
  }

  private loadCategoryDataFromServer(){
    return this.fireDatabase.ref(this.globals.SERVER_PATH_APP + this.globals.SERVER_PATH_TIMER_CATEGORY).once('value')
  }

  private loadTimerTemplateDataFromServer(){
    return this.fireDatabase.ref(this.globals.SERVER_PATH_APP + this.globals.SERVER_PATH_TIMER_TEMPLATE).once('value')
  }

  private loadTimerDataFromServer(){
    let user = this.fireAuth.currentUser;
    return this.fireDatabase.ref(this.globals.SERVER_PATH_USERS + user.uid + this.globals.SERVER_PATH_TIMER).once('value')
  }

}
