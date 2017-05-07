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
    timerItems: '',
  }

  public TEMP_TIMER_ITEMS = {
    id:'',
    title:'',
    timer: '',
    subscribtion: null,
    current: 0,
    max:0,
    needToUpdateTimer:false,
    defaultTimeSet:'00:00:10',
    timeSet:'00:00:10',
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
    color:""
  }

  public SOUND = {
    sound0:{value: 'assets/sound/default.mp3', name: 'default', order: 0},
    sound1:{value: 'assets/sound/1.mp3', name: 'sound1', order: 1},
    sound2:{value: 'assets/sound/2.mp3', name: 'sound2', order: 2},
    sound3:{value: 'assets/sound/3.mp3', name: 'sound3', order: 3},
    sound4:{value: 'assets/sound/4.mp3', name: 'sound4', order: 4},
    sound5:{value: 'assets/sound/5.mp3', name: 'sound5', order: 5},
    sound6:{value: 'assets/sound/6.mp3', name: 'sound6', order: 6},
    sound7:{value: 'assets/sound/7.mp3', name: 'sound7', order: 7},
    sound8:{value: 'assets/sound/8.mp3', name: 'sound8', order: 8},
    sound9:{value: 'assets/sound/9.mp3', name: 'sound9', order: 9},
    sound10:{value: 'assets/sound/10.mp3', name: 'sound10', order: 10},
    sound11:{value: 'assets/sound/11.mp3', name: 'sound11', order: 11},
    sound12:{value: 'assets/sound/12.mp3', name: 'sound12', order: 12},
    sound13:{value: 'assets/sound/13.mp3', name: 'sound13', order: 13},
    sound14:{value: 'assets/sound/14.mp3', name: 'sound14', order: 14}
  };

  public MY_TIMER = {};

  public RANDOM_COLOR : any = ['#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5',
  '#2196F3', '#03A9F4', '#00BCD4', '#009688', '#4CAF50', '#8BC34A', '#CDDC39',
  '#FFC107', '#FF9800', '#FF5722', '#795548', '#9E9E9E', '#607D8B'];
}
