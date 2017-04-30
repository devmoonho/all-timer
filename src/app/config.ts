import { Injectable } from '@angular/core';
// utils

@Injectable()
export class Config{

  public CATETGORY = [{
    name: 'WORK OUT',
    value:'workout',
    defaultImage: 'assets/image/default.jpg',
    defaultSound: 'assets/sound/default.mp3'
  },
  {
    name: 'FOOD',
    value:'food',
    defaultImage: 'assets/image/default.jpg',
    defaultSound: 'assets/sound/default.mp3'
  },
  {
    name: 'STUDY',
    value:'study',
    defaultImage: 'assets/image/default.jpg',
    defaultSound: 'assets/sound/default.mp3'
  },
  {
    name: 'ETC',
    value:'etc',
    defaultImage: 'assets/image/default.jpg',
    defaultSound: 'assets/sound/default.mp3'
  }]

  public TEMP_TIMER = {
    timerId :'',
    name: '',
    summary: '',
    category: 'etc',
    timerItems:
    [{
      id:'',
      title:'',
      timer: '',
      subscribtion: null,
      current: 0,
      max:0,
      needToUpdateTimer:false,
      defaultTimeSet:'00:00:00',
      timeSet:'00:00:00',
      status: 'ready',
      btnStatus: 'start',
      detail: "",
      order: 1,
      nextTimer: false,
      notification:{
        enable:true,
        id: 1,
        sound:'default.mp3',
        data:''
      },
      image: "",
      color:"",
    }]
  }

  public DEFAULT_TIMER =
  [{
    timerId :'',
    name: '',
    summary: '',
    category: 'etc',
    timerItems:
    [{
      id:'',
      title:'',
      timer: '',
      subscribtion: null,
      current: 0,
      max:0,
      needToUpdateTimer:false,
      defaultTimeSet:'00:00:00',
      timeSet:'00:00:00',
      status: 'ready',
      btnStatus: 'start',
      detail:  "",
      order: 1,
      nextTimer: false,
      notification:{
        enable:true,
        id: 1,
        sound:'default.mp3',
        data:''
      },
      image: "",
      color:"",
    }]
  },
  {
    timerId :'',
    name: '',
    summary: '',
    category: 'food',
    timerItems:
    [{
      id:'',
      title:'',
      timer: '',
      subscribtion: null,
      current: 0,
      max:0,
      needToUpdateTimer:false,
      defaultTimeSet:'00:00:00',
      timeSet:'00:00:00',
      status: 'ready',
      btnStatus: 'start',
      detail:  "",
      order: 1,
      nextTimer: false,
      notification:{
        enable:true,
        id: 1,
        sound:'default.mp3',
        data:''
      },
      image: "",
      color:"",
    }]
  },
  {
    timerId :'',
    name: '',
    summary: '',
    category: 'study',
    timerItems:
    [{
      id:'',
      title:'',
      timer: '',
      subscribtion: null,
      current: 0,
      max:0,
      needToUpdateTimer:false,
      defaultTimeSet:'00:00:00',
      timeSet:'00:00:00',
      status: 'ready',
      btnStatus: 'start',
      detail:  "",
      order: 1,
      nextTimer: false,
      notification:{
        enable:true,
        id: 1,
        sound:'default.mp3',
        data:''
      },
      image: "",
      color:"",
    }]
  },
  {
    timerId :'',
    name: '',
    summary: '',
    category: 'workout',
    timerItems:
    [{
      id:'',
      title:'',
      timer: '',
      subscribtion: null,
      current: 0,
      max:0,
      needToUpdateTimer:false,
      defaultTimeSet:'00:00:00',
      timeSet:'00:00:00',
      status: 'ready',
      btnStatus: 'start',
      detail:  "",
      order: 1,
      nextTimer: false,
      notification:{
        enable:true,
        id: 1,
        sound:'default.mp3',
        data:''
      },
      image: "",
      color:"",
    }]
  }];

  public MY_TIMER = [];

  public TEMPLATE = this.TEMP_TIMER['timerItems'][0];
  public CREATE_TIMER = this.TEMP_TIMER;
}
