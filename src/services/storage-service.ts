import { Injectable } from '@angular/core';
import { Globals } from '../app/globals';

// utils
import firebase from 'firebase';
import { Storage } from '@ionic/storage';

import * as moment from 'moment'


@Injectable()
export class StorageService {
  public fireAuth: any;
  public fireStorage: any;

  constructor(
    public globals: Globals,
    public storage: Storage
  ) {
    this.fireAuth = firebase.auth();
    this.fireStorage= firebase.storage();
  }

  public serviceGetCategoryTimer(category):any{
    let timer={};

    return Promise.resolve()
    .then(()=>{
      return this.storage.forEach((val, key)=>{
        if(val.category === category){
          timer[key] = val;
        }
      })
    })
    .then((res)=>{
      console.log("---- serviceGetCategoryTimer done ----");
      return timer;
    })

  }

  public serviceGetAllTimer():any{
    let allTimer={};

    return Promise.resolve()
    .then(()=>{
      return this.storage.forEach((val, key)=>{
        allTimer[key] = val;
      })
    })
    .then((res)=>{
      console.log("---- serviceGetAllTimer done ----");
      return allTimer;
    })
  }

  public serviceSetTimer(key, val):any{
    return Promise.resolve()
    .then(()=>{
      return this.storage.set(key, val);
    })
    .then(()=>{
      console.log("---- serviceSetTimer done ----");
    })
  }

  public serviceGetTimer(key):any{
    return Promise.resolve()
    .then(()=>{
      return this.storage.get(key);
    })
    .then((res)=>{
      console.log("---- serviceSetTimer done ----");
      return res;
    })
  }

  public serviceSetLocalStorage(key, value):any{
    let keys: any = key.split('/');
    let cloneTimer: any;

    return Promise.resolve()
    .then(()=>{
      return this.storage.get(keys[0])
    })
    .then((res)=>{
      if(res===null || res===undefined){return;}
      else{
        for(let i=1; i<keys.length-1; i++){
          res = res[keys[i]]
        }
        res[keys[keys.length-1]] = value;
      }

      console.log(res);
      return this.storage.set(keys[0],res);
    })
    .then(()=>{
      console.log("---- serviceSetLocalStorage done ----");
    })
  }

  public serviceGetLocalStorage(key): any{
    let keys: any = key.split('/');
    let cloneTimer: any;

    return Promise.resolve()
    .then(()=>{
      return this.storage.get(keys[0])
    })
    .then((res)=>{
      if(res===null || res===undefined){return;}
      else{
        for(let i=1; i<keys.length-1; i++){
          res = res[keys[i]]
        }
      }
      console.log("---- serviceSetLocalStorage done ----");
      return res;
    })
  }

  public serviceDeleteLocalStorage(key){
    return this.storage.remove(key);
  }
}
