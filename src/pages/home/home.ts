import { Component } from '@angular/core';
import { NavController, NavParams} from 'ionic-angular';

// pages
import { LoginPage } from '../login/login';
import { StorePage } from '../store/store';
import { TimerPage } from '../timer/timer';
import { TimerListPage } from '../timer-list/timer-list';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  login: any = LoginPage;
  store: any = StorePage;
  timer: any = TimerPage;
  timerList: any = TimerListPage;

  showIcons: boolean = false;
  showTitles: boolean = true;
  pageTitle: string = 'Timer';

  constructor(
    public navCtrl: NavController,
    private navParams: NavParams,
  ){

  }

  onTabSelect(tab: { index: number; id: string; }) {
    console.log(`Selected tab: `, tab);
  }
}
