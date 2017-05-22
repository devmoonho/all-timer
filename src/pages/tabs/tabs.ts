import { Component } from '@angular/core';
import { NavController, NavParams} from 'ionic-angular';

// pages
import { HomePage } from '../home/home';
import { LoginPage } from '../login/login';
import { StorePage } from '../store/store';
import { TimerPage } from '../timer/timer';
import { TimerListPage } from '../timer-list/timer-list';
import { TimerEditorPage } from '../timer-editor/timer-editor';

@Component({
  selector: 'tabs-page',
  templateUrl: 'tabs.html'
})
export class TabsPage {
  home: any = HomePage;
  login: any = LoginPage;
  store: any = StorePage;
  timer: any = TimerPage;
  timerList: any = TimerListPage;
  timerEditor: any = TimerEditorPage;

  showIcons: boolean = false;
  showTitles: boolean = true;

  constructor(
    public navCtrl: NavController,
    private navParams: NavParams,
  ){

  }

  onTabSelect(tab: { index: number; id: string; }) {
    console.log(`Selected tab: `, tab);
  }
}
