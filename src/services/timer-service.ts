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

  public serviceRemoveTimer(timer):any{
    return Promise.resolve()
    .then(()=>{
        return this.removeTimerToServer(timer);
    })
    .then(()=>{
      console.log("---- serviceRemoveTimer done ----");
    })
  }

  public serviceUpdateTimer(timer):any{
    return Promise.resolve()
    .then(()=>{
        return this.updateTimerDataToServer(timer);
    })
    .then(()=>{
      console.log("---- serviceUpdateTimer done ----");
    })
  }

  public serviceAddTimer(timer): any{
    return Promise.resolve()
    .then(()=>{
        return this.saveTimerDataToServer(timer);
    })
    .then(()=>{
      console.log("---- serviceAddTimer done ----");
    })
  }

  public serviceTimerData(): any{
    return Promise.resolve()
    .then(()=>{
      return this.loadTimerDataFromServer();
    })
    .then((res)=>{
      console.log("---- serviceTimerData done ----");
      return res.val();
    })
  }

  public serviceTimerTemplateData(): any{
    return Promise.resolve()
    .then(()=>{
      return this.loadTimerTemplateDataFromServer();
    })
    .then((res)=>{
      console.log("---- serviceTimerTemplateData done ----");
      return res.val();
    })
  }

  public serviceTimerCategoryData(): any{
    return Promise.resolve()
    .then(()=>{
      return this.loadCategoryDataFromServer();
    })
    .then(()=>{
      console.log("---- serviceTimerCategoryData done ----");
    })
  }

  private removeTimerToServer(timer){
    let user = this.fireAuth.currentUser;
    return this.fireDatabase.ref(this.globals.SERVER_PATH_USERS +  user.uid + this.globals.SERVER_PATH_TIMER + timer.timerId ).remove();
  }

  private updateTimerDataToServer(timer){
    let user = this.fireAuth.currentUser;
    return this.fireDatabase.ref(this.globals.SERVER_PATH_USERS +  user.uid + this.globals.SERVER_PATH_TIMER + timer.timerId).update(timer);
  }

  private saveTimerDataToServer(timer){
    let user = this.fireAuth.currentUser;
    let ref = firebase.database().ref(this.globals.SERVER_PATH_USERS +  user.uid + this.globals.SERVER_PATH_TIMER);
    var newPostKey = ref.push().key;
    var updates = {};

    timer.timerId = newPostKey;
    updates[newPostKey] = timer;
    return ref.update(updates);
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
