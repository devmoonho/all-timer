import { Component } from '@angular/core';
import { NavController, NavParams, Events } from 'ionic-angular';
import { UUID } from 'angular2-uuid';
import { Observable } from 'rxjs/Rx';

// services
import { TimerService } from '../../services/timer-service';
import { Config } from '../../app/config';

// pipe
import { CategoryPipe } from '../../pipes/category-pipe';

// pages
import { TimerEditorPage } from '../timer-editor/timer-editor';

@Component({
  selector: 'page-timer-list',
  providers:[TimerService],
  templateUrl: 'timer-list.html',
})
export class TimerListPage {
  rootNavCtrl: NavController;

  timerList: any;
  category: any;

  randomColor: any = ['#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5',
  '#2196F3', '#03A9F4', '#00BCD4', '#009688', '#4CAF50', '#8BC34A', '#CDDC39',
  '#FFC107', '#FF9800', '#FF5722', '#795548', '#9E9E9E', '#607D8B'];

  selectedTimer: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public timerService: TimerService,
    public config: Config,
    public events: Events,
  ){
    this.rootNavCtrl = navParams.get('rootNavCtrl');

    events.subscribe('timer:update-list', () => {
      console.log('timer:update-list');
      this.updateTimerList();
    });
  }

  ngOnInit(){
    this.timerList = this.config.MY_TIMER;
    this.category = this.config.CATETGORY;
  }

  getRandomColor(index: number): string {
    let idx = (index) % this.randomColor.length
    return this.randomColor[idx];
  }

  onCreateTimer(){
    this.navCtrl.push(TimerEditorPage, {
      mode: 'create',
      timer: '',
    });
  }

  onSelectTimer(_timer){
    this.navCtrl.push(TimerEditorPage, {
      mode: 'edit',
      timer: _timer,
    });
  }

  updateTimerList(){
    this.timerService.serviceTimerData()
    .then((res)=>{
      this.timerList = res;
    })
  }
}
