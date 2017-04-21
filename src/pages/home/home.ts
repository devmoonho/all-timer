import { Component } from '@angular/core';
import { NavController, NavParams} from 'ionic-angular';

// pages
import { LoginPage } from '../login/login';
import { StorePage } from '../store/store';
import { TimerPage } from '../timer/timer';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  login: any = LoginPage;
  store: any = StorePage;
  timer: any = TimerPage;

  showIcons: boolean = false;
  showTitles: boolean = true;
  pageTitle: string = 'Full Example';

  constructor(
    public navCtrl: NavController,
    private navParams: NavParams,
  ){
    
  }

  onTabSelect(tab: { index: number; id: string; }) {
    console.log(`Selected tab: `, tab);
  }
}
