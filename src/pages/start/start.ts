import { Component } from '@angular/core';
import { NavController, Events } from 'ionic-angular';

// pages
import { HomePage } from '../home/home';

// utils
import {TranslateService} from '@ngx-translate/core';
import { Network } from '@ionic-native/network';

// services
import { LoginService } from '../../services/login-service';
import { TimerService } from '../../services/timer-service';

@Component({
  selector: 'page-start',
  providers:[LoginService, TimerService],
  templateUrl: 'start.html'
})
export class StartPage {

  constructor(
    public navCtrl: NavController,
    public translate: TranslateService,
    public loginService: LoginService,
    public timerService: TimerService,
    public network: Network,
    public events: Events,
  ) {
  }

  goHomePage(): void{
    let networkState = this.network.type
    let user = this.loginService.serviceCurrentUser();

    if (networkState == 'none'){ // off-line
      if(user){
        console.log(user);
      }else{
        console.log('none user');
      }
    }else{ // on-line
      if(user){
        console.log(user);
      }else{
        this.loginService.serviceAnonymousLogin();
      }
    }

    // off-line
    // 1. check user
    // 2-1. user is null
    // 2-1-1. get default tmier data from local
    // 2-1-2. go to home page

    // 2-2. user is not null
    // 2-2-1. get default timer data from local storage
    // 2-2-2. go to home page

    // on-line
    // 1. check user
    // 2-1. user is null
    // 2-1-1. anonymous login
    // 2-1-2. get default timer data from server
    // 2-1-3. go to home page

    // 2-2. user is not null
    // 2-2-1. get default timer data from server
    // 2-2-2. go to home page
    console.log(networkState);
    // this.navCtrl.setRoot(HomePage);
  }
}
