import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

// pages
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController) {

  }
  goLoginPage(): void{
    this.navCtrl.push(LoginPage);
  }
}
