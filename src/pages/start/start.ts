import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

// pages
import { HomePage } from '../home/home';

// utils
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'page-start',
  templateUrl: 'start.html'
})
export class StartPage {

  constructor(public navCtrl: NavController,
    public translate: TranslateService) {

  }

  goHomePage(): void{
    this.navCtrl.setRoot(HomePage);
  }

}
