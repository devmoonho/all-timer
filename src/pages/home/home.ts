import { Component } from '@angular/core';
import { NavController, NavParams, Events } from 'ionic-angular';
import { UUID } from 'angular2-uuid';
import { Observable } from 'rxjs/Rx';

// animatin
import { trigger, state, style, transition, animate, keyframes} from '@angular/core'

// services
import { TimerService } from '../../services/timer-service';
import { StorageService } from '../../services/storage-service';
import { Config } from '../../app/config';
import { Globals } from '../../app/globals';

// pipe
import { CategoryPipe } from '../../pipes/category-pipe';

// pages
import { TimerPage } from '../timer/timer';
import { TimerListPage } from '../timer-list/timer-list';
import { TimerEditorPage } from '../timer-editor/timer-editor';

@Component({
  selector: 'home-page',
  providers:[TimerService, StorageService],
  templateUrl: 'home.html',
})

export class HomePage {
  rootNavCtrl: NavController;

  categoryMode: any = true;
  currentCategory: any;

  timer: any;
  timerList: any;
  category: any;

  selectedTimer: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public timerService: TimerService,
    public storageService: StorageService,
    public config: Config,
    public globals: Globals,
    public events: Events,
  ){
    this.rootNavCtrl = navParams.get('rootNavCtrl');

    events.subscribe('timer:update-list', () => {
      console.log('timer:update-list');
      this.updateTimerList();
    });
  }

  ngOnInit(){
    this.category = this.config.CATETGORY;
  }

  ionViewWillEnter(){
    this.storageService.serviceGetAllTimer()
    .then((res)=>{
      this.timer = res;
    })
  }

  onSelectCard(idx){
    this.navCtrl.push(TimerListPage, {
      timerList: this.getCategoryTimer(idx),
      category:this.config.CATETGORY[idx]
    })
  }


  getCategoryTimer(idx):any{
    let _retTimer: any = {};
    let _category = this.config.CATETGORY[idx]
    for(let key in this.timer){
      if(this.timer[key].category === _category.value){
        _retTimer[key] = this.timer[key];
      }
    }
    return _retTimer
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

  updateTimerList(){
    this.storageService.serviceGetLocalStorage(this.globals.LOCAL_STORAGE_KEY_TIMER)
    .then((res)=>{
      this.config.MY_TIMER = this.timer = res;
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
