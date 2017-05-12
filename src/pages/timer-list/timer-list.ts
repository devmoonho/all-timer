import { Component } from '@angular/core';
import { NavController, NavParams, Events } from 'ionic-angular';
import { UUID } from 'angular2-uuid';
import { Observable } from 'rxjs/Rx';

// animatin
import { trigger, state, style, transition, animate, keyframes} from '@angular/core'

// services
import { StorageService } from '../../services/storage-service';
import { TimerService } from '../../services/timer-service';
import { Config } from '../../app/config';

// pipe
import { CategoryPipe } from '../../pipes/category-pipe';

// pages
import { TimerPage } from '../timer/timer';
import { TimerEditorPage } from '../timer-editor/timer-editor';

@Component({
  selector: 'page-timer-list',
  providers:[TimerService],
  templateUrl: 'timer-list.html',
})

export class TimerListPage {
  rootNavCtrl: NavController;
  categoryView: string  = 'shown';
  categoryDetail: string  = 'hidden';

  categoryMode: any = true;
  currentCategory: any;

  timerList: any={};

  selectedTimer: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public storageService: StorageService,
    public timerService: TimerService,
    public config: Config,
    public events: Events,
  ){
    this.rootNavCtrl = navParams.get('rootNavCtrl');

    events.subscribe('timer:update-list', (category) => {
      console.log('timer:update-list');
      this.updateTimerList(category);
    });

    events.subscribe('timer:remove-list', (category) => {
      console.log('timer:remove-list');
      this.updateTimerList(category);
    });
  }

  ngOnInit(){
    this.currentCategory = this.navParams.get('category');
    this.updateTimerList(this.currentCategory.value);
  }

  ionViewWillEnter(){
    this.currentCategory = this.navParams.get('category');
    this.updateTimerList(this.currentCategory.value);
  }

  getRandomColor(index: number): string {
    let idx = (index) % this.config.RANDOM_COLOR.length
    return this.config.RANDOM_COLOR[idx];
  }

  onBackCategory(){
    this.navCtrl.pop();
  }

  onCreateTimer(){
    this.navCtrl.push(TimerEditorPage, {
      mode: 'create',
      timer: '',
      category: this.currentCategory,
    });
  }

  onSelectTimer(_timer){
    this.navCtrl.push(TimerPage, {
      mode: 'edit',
      timer: _timer,
      category: this.currentCategory,
    });
  }

  updateTimerList(category){
    this.currentCategory = this.getCategoryByValue(category);
    this.storageService.serviceGetCategoryTimer(category)
    .then((res)=>{
      this.timerList = res;
    })
  }

  getCategoryByValue(_value){
    for(let obj of this.config.CATETGORY){
      if(_value === obj.value){
        return obj;
      }
    }
    return this.currentCategory;
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
