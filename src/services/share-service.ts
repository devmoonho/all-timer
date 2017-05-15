import { Injectable } from '@angular/core';
import { Globals } from '../app/globals';

// utils
import firebase from 'firebase';
import { Storage } from '@ionic/storage';

import * as moment from 'moment';

@Injectable()
export class ShareService {
  public fireAuth: any;
  public fireDatabase: any
  public fireStorage: any

  constructor(
    private globals: Globals,
    private storage: Storage
  ) {
    this.fireAuth = firebase.auth();
    this.fireDatabase = firebase.database();
    this.fireStorage = firebase.storage().ref();
  }

  public serviceUploadTimer(timer):any{
    let msg, uid: any;
    let uploadRef: any;
    let current = 0;
    let total = Object.keys(timer.timerItems).length;

    return Promise.resolve()
    .then(()=>{
      for(let key in timer.timerItems){
        msg = (timer.timerItems[key].image).replace('data:image/png;base64,','');
        uid = timer.timerItems[key].id
        if(msg===''|| msg.includes('assets/image/')){
          current += 1;
          if(current >= total){ return 'complate'; }
          continue;
        }
        uploadRef = this.fireStorage.child('timer-image/' + uid);
        uploadRef.putString(msg, 'base64')
        .then((res:any)=>{
          console.log('serviceUploadFile', res);
          current += 1;
          if(current >= total){ return 'complate'; }
        })
      }
    })
    .then(()=>{
      return this.saveShareTimerDataToServer(timer);
    })
    .then(()=>{
      console.log("---- serviceUploadTimer done ----");
      return 'complete';
    })
  }

  public serviceDownloadTimer(timer):any{
    let downloadRef: any;
    let msg, uid: any;

    for(let key in timer.timerItems){
      uid = timer.timerItems[key].id
      downloadRef = this.fireStorage.child('timer-image/'+ uid)
      downloadRef.getDownloadURL()
      .then((res)=>{
        console.log('serviceDownloadTimer', res);
      })
    }
  }

  private saveShareTimerDataToServer(timer){
    let user = this.fireAuth.currentUser;
    let ref = firebase.database().ref(this.globals.SERVER_PATH_SHARE);
    let shareKey = timer.timerId;
    let updates = {};
    let cnt: number = 0;

    console.log('saveShareTimerDataToServer');
    for(let key in timer.timerItems){
      let _timer = timer.timerItems[key];
      _timer.order = cnt;
      _timer.timer = '';
      _timer.subscribtion = '';
      _timer.max = 1;
      _timer.current = 0;
      _timer.status = 'ready';
      _timer.btnStatus= 'start';
      _timer.nextTimer = false;
      _timer.image = '';
      cnt +=1;
    }

    timer.timerId = shareKey;
    updates[shareKey] = timer;
    return ref.update(updates);
  }
}
