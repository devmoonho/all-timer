import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

// utils
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'page-start',
  templateUrl: 'start.html'
})
export class StartPage {

  constructor(public navCtrl: NavController,
    private translate: TranslateService) {
      
  }

  goHomePage(){

  }

}
