import { Injectable } from '@angular/core';

Injectable()
export class Globals{
  // for server storage
  public SERVER_PATH_USERS: any = '/users/';
  public SERVER_PATH_USER_PROFILE: any = '/profile/';
  public SERVER_PATH_TIMER: any = '/timer/';

  // for local storage
  public LOCAL_STORAGE_KEY_USER_INFO: any = 'userInfo';
}
