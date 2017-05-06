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

  public MY_TIMER = {};

  public RANDOM_COLOR : any = ['#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5',
  '#2196F3', '#03A9F4', '#00BCD4', '#009688', '#4CAF50', '#8BC34A', '#CDDC39',
  '#FFC107', '#FF9800', '#FF5722', '#795548', '#9E9E9E', '#607D8B'];
}
