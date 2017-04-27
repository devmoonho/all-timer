import { Injectable } from '@angular/core';

@Injectable()
export class Globals{
  // for server storage
  public SERVER_PATH_USERS: any = '/users/';
  public SERVER_PATH_USER_PROFILE: any = '/profile/';
  public SERVER_PATH_TIMER: any = '/timer/';

  public SERVER_PATH_APP: any = '/app/';
  public SERVER_PATH_TIMER_CATEGORY: any = '/timer-category/';
  public SERVER_PATH_TIMER_TEMPLATE: any = '/timer-template/';

  // for local storage
  public LOCAL_STORAGE_KEY_USER_INFO: any = 'userInfo';

  // variable
  public WEB_CLINED_ID: any = '902931259626-87cv97578lsa82ea92us4o3h1qje31u4.apps.googleusercontent.com';
  public FIREBASE_CONFIG: any = {
    apiKey: "AIzaSyDEdDmwkxWuyjgrkyPAjKK-YafoahwJAk4",
    authDomain: "all-timer.firebaseapp.com",
    databaseURL: "https://all-timer.firebaseio.com",
    projectId: "all-timer",
    storageBucket: "all-timer.appspot.com",
    messagingSenderId: "902931259626"
  };
  public PUSH_MESSAGE_SENDER_ID: any ='902931259626';
}
