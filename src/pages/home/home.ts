import { Component } from '@angular/core';
import { NavController, NavParams, Events } from 'ionic-angular';
import { UUID } from 'angular2-uuid';
import { Observable } from 'rxjs/Rx';

// animatin
import { trigger, state, style, transition, animate, keyframes} from '@angular/core'

// services
import { TimerService } from '../../services/timer-service';
import { Config } from '../../app/config';

// pipe
import { CategoryPipe } from '../../pipes/category-pipe';

// pages
import { TimerPage } from '../timer/timer';
import { TimerListPage } from '../timer-list/timer-list';
import { TimerEditorPage } from '../timer-editor/timer-editor';

@Component({
  selector: 'home-page',
  providers:[TimerService],
  templateUrl: 'home.html',
})

export class HomePage {
  rootNavCtrl: NavController;

  categoryMode: any = true;
  currentCategory: any;

  timerList: any;
  category: any;

  selectedTimer: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public timerService: TimerService,
    public config: Config,
    public events: Events,
  ){
    this.rootNavCtrl = navParams.get('rootNavCtrl');

    events.subscribe('timer:update-list', (_category) => {
      console.log('timer:update-list');
      this.updateTimerList(_category);
    });
  }

  ngOnInit(){
    this.timerList = this.config.MY_TIMER;
    this.category = this.config.CATETGORY;
  }

  onSelectCard(idx){
    this.navCtrl.push(TimerListPage, { 
      timerList:this.timerList,
      category:this.config.CATETGORY[idx]
    })
  }

  onBackCategory(){

  }

  onCreateTimer(){
    this.navCtrl.push(TimerEditorPage, {
      mode: 'create',
      timer: '',
      category: this.category[this.category.length - 1],
    });
  }

  onSelectTimer(_timer){
    this.navCtrl.push(TimerPage, {
      mode: 'edit',
      timer: _timer,
      category: this.currentCategory,
    });
  }

  updateTimerList(_category){
    this.timerService.serviceTimerData()
    .then((res)=>{
      this.timerList = res;
    })
  }

  getCategoryByValue(_value){
    for(let obj of this.category){
      if(_value === obj.value){
        return obj;
      }
    }
    return this.category[0];
  }

  utilsArrayToObject(arr){
    let _obj:any = {};
    for(let item of arr){
      item.id = UUID.UUID();
      _obj[item.id] = item;
    }
    return _obj;
  }

  utilsObjectToArray(obj){
    return Object.keys(obj).map((k) => obj[k])
  }
}
