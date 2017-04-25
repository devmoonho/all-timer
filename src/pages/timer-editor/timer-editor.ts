import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { UUID } from 'angular2-uuid';
import { Observable } from 'rxjs/Rx';

@Component({
  selector: 'page-timer-editor',
  templateUrl: 'timer-editor.html'
})
export class TimerEditorPage{

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
    timerItem:[
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
        order: 2,
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
      }]
    },
    {
      timerId :UUID.UUID(),
      name: 'sample',
      summary: 'sample Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      category: '',
      timerItem:[
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

  constructor() { }

  goAddTimer(){
    let _timer = Object.assign({}, this.templateTimer)
    _timer.id = UUID.UUID();
    this.timer[0].timerItem.push(_timer);
  }

  goToggleRemove(){
    this.removeMode = (this.removeMode == true) ? false : true;
  }

  goRemoveTimer(event,timer){
    event.stopPropagation();
    console.log(timer);
    this.timer[0].timerItem = this.timer[0].timerItem.filter((jsonObject) => {
        return jsonObject.id != timer.id;
    });
  }

  goSave(){
    console.log('save');
  }

  goTimerEdit(event, timer){
    event.stopPropagation();
    console.log(timer);
  }

  goReorderItems(evt){
    console.log(evt);
  }
}
