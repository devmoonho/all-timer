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
import { TimerEditorPage } from '../timer-editor/timer-editor';

@Component({
  selector: 'page-timer-list',
  providers:[TimerService],
  templateUrl: 'timer-list.html',
  // animations: [
  //   trigger('mainCardAnimation', [
  //   state('shown' , style({opacity: 1 })),
  //   state('hidden', style({opacity: 0, 'display':'none' })),
  //   transition('hidden => shown', animate('.1s'))]),]
  // animations: [
  //   trigger('mainCardAnimation', [
  //     state('inactive' , style({opacity: 0, transform: 'translateX(50px) scale(1.5)'})),
  //     state('active', style({opacity: 1, transform: 'translateX(0) scale(1)'})),
  //     state('click', style({})),
  //     transition('inactive => active', animate('.5s')),
  //     transition('active <=> click',
  //     animate(500, keyframes([
  //       style({opacity: 1, transform: 'scale(1)',     offset: 0}),
  //       style({opacity: 1, transform: 'scale(1.2)',     offset: 0.5}),
  //       style({opacity: 1, transform: 'scale(1)',     offset: 1}),
  //       ])
  //     ))
  //   ]),
  // ],
})

export class TimerListPage {
  rootNavCtrl: NavController;
  // cardsAnimationState: string[]  = ['inactive', 'inactive', 'inactive', 'inactive'];
  categoryView: string  = 'shown';
  categoryDetail: string  = 'hidden';

  categoryMode: any = true;
  currentCategory: any;

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
    this.currentCategory = this.config.CATETGORY[0];
  }

  // ionViewWillLeave(){
  //   this.cardsAnimationState.forEach((el, idx)=>{
  //       this.cardsAnimationState[idx] = 'inactive';
  //   })
  // }
  //
  // ionViewDidEnter(){
  //   let idx:number = 0;
  //   let timerId = setInterval(() => {
  //     this.cardsAnimationState[idx++]= 'active';
  //     if(idx >= this.cardsAnimationState.length){clearInterval(timerId);}
  //   }, 100);
  // }

  getRandomColor(index: number): string {
    let idx = (index) % this.randomColor.length
    return this.randomColor[idx];
  }

  onSelectCard(idx){
    this.categoryView = 'hidden';
    this.categoryDetail = 'shown';
    this.currentCategory = this.category[idx];
  }

  onBackCategory(){
    this.categoryView = 'shown';
    this.categoryDetail = 'hidden';
  }

  onCreateTimer(){
    this.navCtrl.push(TimerEditorPage, {
      mode: 'create',
      timer: '',
      category: this.currentCategory,
    });
  }

  onSelectTimer(_timer){
    this.navCtrl.push(TimerEditorPage, {
      mode: 'edit',
      timer: _timer,
      category: this.currentCategory,
    });
  }

  updateTimerList(){
    this.timerService.serviceTimerData()
    .then((res)=>{
      this.timerList = res;
    })
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
