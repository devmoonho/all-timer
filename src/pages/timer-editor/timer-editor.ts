import { Component } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations'
import { reorderArray } from 'ionic-angular';
import { UUID } from 'angular2-uuid';
import { Observable } from 'rxjs/Rx';

//pages

@Component({
  selector: 'page-timer-editor',
  templateUrl: 'timer-editor.html',
  animations: [
    trigger('timerAnimationMode', [
    state('shown' , style({opacity: 1 })),
    state('hidden', style({opacity: 0, 'display':'none' })),
    transition('hidden => shown', animate('.5s'))]),
  ]
})
export class TimerEditorPage{
  viewMode: string = 'shown';
  inputMode: string = 'hidden';
  colorMode: string = 'hidden';

  selectedColor: string = '#000000';

  currentTimer: any;

  timerItems: any;
  templateTimer: any = {
    id: '',
    title:'Please enter',
    timer: Observable.timer(0, 1000),
    subscribtion: null,
    current: 0,
    max:0,
    defaultTimeSet:'00:00:00',
    timeSet:'00:00:00',
    status: 'ready',
    btnStatus: 'start',
    detail:  'Please enter',
    order: 1,
    nextTimer: false,
    notification:{
      enable:true,
      id: 1,
      sound:'default.mp3',
      data:''
    },
    image: '',
    color:"#E91E63",
  }

  timer: any = [
  {
    timerId :UUID.UUID(),
    name: 'sample',
    summary: 'sample Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    category: '',
    timerItems:[
      {
        id: UUID.UUID(),
        title:'운동',
        timer: Observable.timer(0, 1000),
        subscribtion: null,
        current: 0,
        max:0,
        defaultTimeSet:'00:00:10',
        timeSet:'00:00:10',
        status: 'ready',
        btnStatus: 'start',
        detail:  "aute veniam veniam dolor duis illum multos quid fore esse noster quae quorum elit aute amet summis summis labore quae culpa illum amet fore sunt quem fugiat elit tempor export",
        order: 1,
        nextTimer: false,
        notification:{
          enable:true,
          id: 1,
          sound:'default.mp3',
          data:''
        },
        image: "http://www.livestrong.com/wp-content/uploads/2013/05/NewTrainer_JBBlog_iStock_000017277101Medium.jpg",
        color:"#E91E63",
      },
      {
        id: UUID.UUID(),
        title:'高考',
        timer: Observable.timer(0, 1000),
        subscribtion: null,
        current: 0,
        max:0,
        defaultTimeSet:'00:00:07',
        timeSet:'00:00:07',
        status: 'ready',
        btnStatus: 'start',
        detail:  "aute veniam veniam dolor duis illum multos quid fore esse noster quae quorum elit aute amet summis summis labore quae culpa illum amet fore sunt quem fugiat elit tempor export",
        order:0,
        nextTimer: false,
        notification:{
          enable:false,
          id: 1,
          sound:'default.mp3',
          data:''
        },
        image: 'http://p1.img.cctvpic.com/photoAlbum/templet/special/PAGEa6hEmeHGH5f9GdaNVrBw160529/ELMTybetDju4MYylXRQirEyi160529_1465098233.jpg',
        color:"#00B0FF",
      }]
    },
    {
      timerId :UUID.UUID(),
      name: 'sample',
      summary: 'sample Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      category: '',
      timerItems:[
        {
          id: UUID.UUID(),
          title:'高考',
          timer: Observable.timer(0, 1000),
          subscribtion: null,
          current: 0,
          max:0,
          defaultTimeSet:'00:00:07',
          timeSet:'00:00:07',
          status: 'ready',
          btnStatus: 'start',
          detail:  "aute veniam veniam dolor duis illum multos quid fore esse noster quae quorum elit aute amet summis summis labore quae culpa illum amet fore sunt quem fugiat elit tempor export",
          order:4,
          nextTimer: false,
          notification:{
            enable:false,
            id: 1,
            sound:'default.mp3',
            data:''
          },
          image: 'http://p1.img.cctvpic.com/photoAlbum/templet/special/PAGEa6hEmeHGH5f9GdaNVrBw160529/ELMTybetDju4MYylXRQirEyi160529_1465098233.jpg',
          color:"#00B0FF",
        }
      ]
    }
  ];

  categoryList: any = [
    {
      name: 'WROK OUT',
      value:'workout',
      defaultImage: '',
      defaultSound: ''
    },
    {
      name: 'FOOD',
      value:'food',
      defaultImage: '',
      defaultSound: ''
    },
    {
      name: 'STUDY',
      value:'study',
      defaultImage: '',
      defaultSound: ''
    },
    {
      name: 'ETC',
      value:'etc',
      defaultImage: '',
      defaultSound: ''
    }
  ];

  removeMode: boolean = false;

  constructor() {
   }

  ngOnInit(){
    // this.currentTimer = this.templateTimer;
    this.timerItems = this.timer[0].timerItems;
    this.currentTimer = this.templateTimer;
    this.utilsSortByOrder(this.timerItems)
  }

  utilsSortByOrder(timerItems){
    timerItems.sort(function(a, b){return a.order - b.order});
  }

  utilsGetTimerPositionByTimer(timer){
    let cnt: number = 0;
    for(let _timer of this.timerItems){
      if(_timer == timer){
        return cnt;
      }
      cnt +=1;
    }
    return -1;
  }

  setMode(mode){
    switch (mode){
      case 'view':
        this.inputMode = 'hidden';
        this.colorMode = 'hidden';
        this.viewMode= 'shown';
      break;
      case 'input':
        this.inputMode= 'shown';
        this.colorMode = 'hidden';
        this.viewMode= 'hidden';
      break;
      case 'color':
        this.inputMode = 'hidden';
        this.colorMode = 'shown';
        this.viewMode= 'hidden';
      break;
      default:
        this.inputMode = 'hidden';
        this.colorMode = 'hidden';
        this.viewMode= 'shown';
      break;
    }
  }

  onColorPicker(){
    this.setMode('color');
  }

  onSetColor(event, color){
    event.stopPropagation();
    this.selectedColor = color;
    this.setMode('input');
  }

  onCancelTimeSet(){
    this.setMode('input');
  }

  onChangeTimeSet(){
    let _timer: any = this.timerItems[this.utilsGetTimerPositionByTimer(this.currentTimer)];
    _timer.timeSet= this.currentTimer.timeSet;
    _timer.defaultTimeSet = this.currentTimer.timeSet;
  }

  goAddTimer(){
    let _timer = Object.assign({}, this.templateTimer)
    _timer.id = UUID.UUID();
    this.timerItems.push(_timer);
  }

  goToggleRemove(){
    this.removeMode = (this.removeMode == true) ? false : true;
  }

  goRemoveTimer(event,timer){
    event.stopPropagation();
    console.log(timer);
    this.timerItems = this.timerItems.filter((jsonObject) => {
        return jsonObject.id != timer.id;
    });
  }

  goSave(){
    console.log('save');
  }

  goTimerEdit(event, timer){
    event.stopPropagation();
    console.log(timer);
    this.currentTimer = timer;
    this.setMode('input');
  }

  goSaveTimerItems(title, detail){
    let _timer: any = this.timerItems[this.utilsGetTimerPositionByTimer(this.currentTimer)];
    _timer.title = title;
    _timer.detail = detail;

    this.setMode('view');
  }

  goCancelTimerItems(title, detail){
    title = detail = '';
    this.setMode('view');
  }

  goReorderItems(evt){
    this.timerItems = reorderArray(this.timerItems, evt);
  }
}
