import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

// pages
import { HomePage } from '../home/home';

// utils
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})

export class LoginPage {
  loginSwitch: any = "login";
  
  constructor( public navCtrl: NavController, public translate: TranslateService) {

  }
}
