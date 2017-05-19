import { Component, ViewChild, ElementRef, NgZone } from '@angular/core';

import { Content, NavController, NavParams, AlertController, Platform, Events } from 'ionic-angular';

// services
import { TimerService } from '../../services/timer-service';
import { LoginService } from '../../services/login-service';
import { StorageService } from '../../services/storage-service';

// utils
import { BackgroundMode } from '@ionic-native/background-mode';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';

import { Observable } from 'rxjs/Rx';
import { DatePicker } from '@ionic-native/date-picker';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { Device } from '@ionic-native/device';
import { UUID } from 'angular2-uuid';
import { NativeAudio } from '@ionic-native/native-audio';
import { Vibration } from '@ionic-native/vibration';

import { Config } from '../../app/config';
import { Globals } from '../../app/globals';

// pages
import { LoginPage } from '../login/login';
import { TimerEditorPage } from '../timer-editor/timer-editor';

// pipe
import { ToArrayPipe } from '../../pipes/toArray-pipe';

// animation
import { trigger, state, style, transition, animate } from '@angular/core'

@Component({
  selector: 'page-timer',
  providers: [LoginService, StorageService],
  animations: [
    trigger('animationDetailMode', [
    state('shown' , style({opacity: 1 })),
    state('hidden', style({opacity: 0, 'display':'none' })),
    transition('hidden => shown', animate('.5s'))]),
  ],
  templateUrl: 'timer.html'
})

export class TimerPage {
  @ViewChild(Content) content: Content;
  zone: NgZone;

  counter: number = 0;
  current: number = 0;
  max: number = 0;
  stroke: number = 15;
  radius: number = 90;
  semicircle: boolean = false;
  rounded: boolean = true;
  responsive: boolean = false;
  clockwise: boolean = true;
  color: string = '#45ccce';
  background: string = '#eaeaea';
  duration: number = 800;
  animation: string = 'easeOutCubic';
  animationDelay: number = 0;
  animations: string[] = [];
  gradient: boolean = false;
  realCurrent: number = 0;

  timerString: string = "";
  btnState: string = "start"

  subscribtion: any;
  timer:any;
  timerItems: any;

  continuousMode: boolean = false;
  continuousCallback: any;

  notiAlert: any;

  rangeNumber: number = 0;

  simpleMode: boolean = false;
  repeatCounter: number=0;

  detailShown: string = 'hidden';
  detailMode: boolean = false;

  btnStatus: string = 'start';

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public translate: TranslateService,
    public loginService: LoginService,
    public backgroundMode: BackgroundMode,
    public datePicker: DatePicker,
    public localNotifications: LocalNotifications,
    public elRef: ElementRef,
    public device: Device,
    public nativeAudio: NativeAudio,
    public platform: Platform,
    public events : Events,
    public timerService: TimerService,
    public storageService: StorageService,
    public vibration: Vibration,
    public globals: Globals,
    public config: Config,
  ) {
    events.subscribe('timer:update-list', (_category, _timer) => {
      console.log('timer:update-list');
      this.updateTimerList(_timer);
    });

    events.subscribe('timer:remove-list', (_category, _timer) => {
      console.log('timer:remove-list');
      this.removeTimer(_timer);
    });
  }

  ngOnInit() {
    this.timer = this.config.RUNNING_TIMER[this.navParams.get('timer').timerId];

    if(this.timer===undefined){
      this.timer = this.navParams.get('timer');
      this.initTimer();
    }
    this.initTimerItems();
    this.setBtnStatus();
  }

  ionViewDidEnter(){

    console.log('ionViewDidEnter', this.content._scroll, this.config.RUNNING_TIMER[this.navParams.get('timer').timerId]);
  }

  initTimer(){
    let category = this.navParams.get('category');
    let items = this.timer.timerItems;

    for(let key in items){
      items[key].max = this.getMax(items[key].timeSet)==0?1:this.getMax(items[key].timeSet);
      items[key].timer = Observable.timer(0, 1000);
      items[key].image = items[key].image===''?category.defaultTimerImage:items[key].image;
      items[key].color = items[key].color==''?'#3F51B5': items[key].color;
    }
    this.initTimerItems();
  }

  initTimerItems(){
    this.timerItems = this.utilsObjectToArray(this.timer.timerItems);
    this.timerItems.sort(function(a, b){return a.order - b.order});
  }

  updateTimerList(_timer){
    if(this.timer.timerId == _timer.timerId){
      this.onStopAllTimer(_timer);
      delete this.config.RUNNING_TIMER[this.timer.timerId];

      this.storageService.serviceGetTimer(this.timer.timerId)
      .then((res)=>{
        if(res!==null){
          this.timer = res;
          this.initTimer();
        }
      })
    }
  }

  onStopAllTimer(timer){
    let _timer :any = this.config.RUNNING_TIMER[timer.timerId];

    if(_timer!==undefined){
      for(let key in _timer.timerItems){
        let el = _timer.timerItems[key];
        el.nextTimer = false;
        if(el.status == 'running'){
          el.btnStatus = 'end';
          this.goTimerAction(el)
        }
      }
    }
  }

  removeTimer(_timer){
    this.onStopAllTimer(_timer);
    delete this.config.RUNNING_TIMER[_timer.timerId];
  }

  setBtnStatus(){
    let currentTimer = this.getNextTimerUI();
    if(currentTimer==''){
      this.btnStatus = 'start';
    }else{
      this.btnStatus = currentTimer.btnStatus;
    }
  }

  loadLocalSavedImage():any{
    let category = this.navParams.get('category');
    this.storageService.serviceGetLocalStorage(this.timer.timerId)
    .then((res:any)=>{
      this.timerItems.forEach((el)=>{
        if(res === null){
          el.image = category.defaultTimerImage
        }else{
          el.image = res[el.id]['image'];
        }
      })
    })
  }

  ionViewDidLeave(){
    console.log('ionViewDidLeave')
  }

  onGoCurrentTimer(){
    let _timer = this.getNextTimerUI();
    if(_timer.status == 'running'){
      this.timerAction({item: _timer, status: "p"});
      this.timerAction({item: _timer, status: "r"});
    }
    this.setPositionForTimer(_timer);
  }

  onAllTimerCancel(){
    this.onStopAllTimer(this.timer);
    delete this.config.RUNNING_TIMER[this.timer.timerId];
  }

  onStartAllTimer(){
    let _timer = this.getNextTimerUI();

    if(_timer===''){
      _timer = this.timerItems[0];
    }

    this.setNextTimerUI(_timer);

    switch(_timer.btnStatus){
      case 'start':
      this.btnStatus = 'pause';
      _timer.btnStatus = 'start';
      this.goTimerAction(_timer);
      break;
      case 'pause':
      this.btnStatus = 'resume';
      this.goTimerAction(_timer);
      break;
      case 'resume':
      this.btnStatus = 'pause';
      this.goTimerAction(_timer);
      break;
      case 'end':
      this.btnStatus = 'start';
      _timer.btnStatus = 'start';
      this.goTimerAction(_timer);
      break;
    }
    this.setPositionForTimer(_timer);
  }

  onBack(){
    this.navCtrl.pop();
  }

  onEditTimer(){
    let _timer = this.navParams.get('timer');
    this.navCtrl.push(TimerEditorPage, {
      mode: 'edit',
      timer: _timer,
      category: _timer.category
    });
  }

  popLocalNotifications(timer){
    let times = 3;
    let cnt = 0;
    let btnConfirm: string;

    if(this.device.uuid == null){return;}
    this.nativeAudio.preloadSimple(timer.id, timer.notification.sound)
    .then(()=>{
      this.nativeAudio.play(timer.id);
    });

    let interval = setInterval(() => {
      this.vibration.vibrate(1000);
      if(cnt >= times){
        clearInterval(interval);
      }
      cnt +=1;
    }, 2000);


   this.translate.get('Common.Confirm')
   .subscribe((res: string) => {
     btnConfirm = res;
   })

   this.notiAlert = this.alertCtrl.create({
     title: timer.title,
     subTitle: timer.detail,
     buttons: [{
       text: btnConfirm,
       handler: () => {
         clearInterval(interval);
         this.nativeAudio.unload(timer.id);
       }
     }],
     enableBackdropDismiss: false
   });

   this.notiAlert.present();
  }

  onTimerSetting(_item){
    console.log('timer setting');
  }

  goNotificationToggle(timer){
    timer.notification.enable = timer.notification.enable? false: true;
  }

  goIncrease():void{
    this.datePicker.show({
      date: new Date(),
      mode: 'time',
      androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_LIGHT,
      is24Hour: true
    }).then(
      date => console.log('Got date: ', date),
      err => console.log('Error occurred while getting date: ', err)
    );
  }

  setContinuousMode(enabled: boolean){
    this.continuousMode = enabled;
  }

  isContinuousMode(): boolean{
    return this.continuousMode;
  }

  isAllTimerSleep(): boolean{
    if(this.isContinuousMode()) {return false;}

    for(let _timer of this.timerItems){
      if(_timer.status == 'running'){
        return false;
      }
    }
    return true;
  }

  startContinuousTimer(){
    if(this.isContinuousMode()) return;
    this.setContinuousMode(true);

    this.loopTimer(this.timerItems.length, 0, (res)=>{
        if(this.timer.repeat> 0){
          this.timer.repeat-= 1;
          this.setNextTimerUI('');
          this.onStartAllTimer();
        }else{
          this.setNextTimerUI('');
          this.setContinuousMode(false);
          this.btnStatus = 'start';
          delete this.config.RUNNING_TIMER[this.timer.timerId];
          console.log('done', this.config.RUNNING_TIMER);
        }
    })
  }

  loopTimer(max, currentPos, done){
    this.doNextAction((res) =>{
      if(max <= res){
        return done(res);
      }
      let timer =this.timerItems[res];
      this.setPositionForTimer(timer);

      if(timer.status != 'running'){
        this.goTimerAction(timer);
      }
      this.setNextTimerUI(timer);

      this.loopTimer(max, res, done);
    })
  }

  setPositionForTimer(timer){
    let doc:any = document;
    let el:any = doc.getElementById('timerId_' + timer.id);

    if(el === null || this.content._scroll === null) {
      return;
    }
    this.content.scrollTo(0, el.offsetTop - 10, 1000)
  }

  doNextAction(cb){
    this.continuousCallback= cb;
  }

  getTimerById(id):any{
    for(let _timer of this.timerItems){
      if(_timer.id == id){
        return _timer;
      }
    }
    return -1;
  }

  executeNextTimer(timer){
    let currentPosition: number;
    let nextPosition: number;

    if(this.getNextTimerPosition() != -1 ){ // is there nextposition
      currentPosition= this.getTimerPostion(timer);
      nextPosition = currentPosition == this.getNextTimerPosition() ? this.getNextTimerPosition() + 1 : this.getNextTimerPosition();
      this.startContinuousTimer();
      this.continuousCallback(nextPosition);
    }else{
      this.btnStatus = 'start';
      delete this.config.RUNNING_TIMER[this.timer.timerId];
    }
  }

  getTimerPostion(timer): number{
    let pos: number = 0;
    for(let _timer of this.timerItems){
      if(_timer == timer){
        return pos;
      }
      pos +=1;
    }
    return this.timerItems.length == pos ? -1 : pos;
  }

  getNextTimerPosition(): number{
    let pos: number = 0;
    for(let _timer of this.timerItems){
      if(_timer.nextTimer == true){
        return pos;
      }
      pos +=1;
    }
    return this.timerItems.length == pos ? -1 : pos;
  }

  setNextTimerUI(timer){
    for(let _timer of this.timerItems){
      if(timer == _timer){
        _timer.nextTimer= true;
      }else{
        _timer.nextTimer= false;
      }
    }
  }

  getNextTimerUI():any{
    for(let _timer of this.timerItems){
      if(_timer.nextTimer == true){
        return _timer
      }
    }
    return '';
  }

  goNextTimerSet(timer, idx){
    this.setNextTimerUI(timer);
  }

  goNextTimerStop(){
    this.setNextTimerUI('');
  }

  getMax(timeSet: string):number{
    let day:number = 0;
    let hour:number = moment(timeSet, "HH:mm:ss").hour();
    let minunt:number = moment(timeSet, "HH:mm:ss").minute();
    let seconds:number = moment(timeSet, "HH:mm:ss").second();
    return this.utilsConvertSecond({day, hour, minunt, seconds});
  }

  onCancelTimeSet(timer:any){
    timer.needToUpdateTimer = false;
  }

  onPopDataTimePicker(timer: any){
    timer.needToUpdateTimer = true;
    if(timer.status == 'running'){
      timer.btnStatus = 'pause';
      this.goTimerAction(timer)
    }
  }

  onResetTimer(timer){
    if(timer.status == 'running'){
      timer.btnStatus = 'pause';
      this.goTimerAction(timer)
    }
    timer.timeSet = timer.defaultTimeSet;

    this.setTimer(timer)
    timer.needToUpdateTimer = false;
  }

  onChangeTimeSet(item:any): void{
    item.defaultTimeSet = item.timeSet;
    this.setTimer(item);
    item.needToUpdateTimer = false;
  }


  setTimer(timer){
    let day:number = 0;
    let hour:number = moment(timer.timeSet, "HH:mm:ss").hour();
    let minunt:number = moment(timer.timeSet, "HH:mm:ss").minute();
    let seconds:number = moment(timer.timeSet, "HH:mm:ss").second();

    let convertSeconds = this.utilsConvertSecond({day, hour, minunt, seconds});
    timer.max = convertSeconds;
    timer.current = 0;
  }

  utilsTimerStringFormat({max, current}):string{
    let timerVar = max - current;
    return moment().startOf('day').seconds(timerVar).format('HH:mm:ss');
  }

  utilsConvertSecond({day, hour, minunt, seconds}):number{
    return (day * 24 * 60 * 60) + (hour * 60 * 60) + (minunt * 60) + seconds;
  }

  utilsBackGroundMode(enable: boolean){
    if(this.device.uuid == null){return;}
    if(enable){
      this.backgroundMode.enable();
      console.log('enabled backgroundMode');
    }else{
      this.backgroundMode.disable();
      console.log('disabled backgroundMode');
    }
  }

  goTimerAction(item){
    switch(item.btnStatus){
      case "start":
      if(item.needToUpdateTimer){ this.onChangeTimeSet(item); }
      this.timerAction({item, status: "s"});
      item.btnStatus= "pause";
      if(this.getNextTimerUI()==item){this.btnStatus = 'pause';}

      this.config.RUNNING_TIMER[this.timer.timerId] = this.timer;
      break;

      case "pause":
      this.timerAction({item, status: "p"});
      item.btnStatus = "resume";
      if(this.getNextTimerUI()==item){this.btnStatus = 'resume';}
      break;

      case "resume":
      if(item.needToUpdateTimer){ this.onChangeTimeSet(item); }
      this.timerAction({item, status: "r"});
      item.btnStatus = "pause";
      if(this.getNextTimerUI()==item){this.btnStatus = 'pause';}
      break;

      case "end":
      this.timerAction({item, status: "e"});
      item.btnStatus = "start";
      this.executeNextTimer(item);
      if(item.notification.enable) {
        this.popLocalNotifications(item)
      }
      break;
    }
  }

  timerAction({item, status}){
    switch(status){
      case "s":
      this.utilsBackGroundMode(true);
      item.subscribtion = item.timer.subscribe(t => {
        item.current = t;
        item.status = "running";
        item.timeSet = this.utilsTimerStringFormat({max: item.max, current: item.current});
        if(item.current >= item.max){
          item.btnStatus = "end";
          this.goTimerAction(item);
        }
      })
      break;

      case "p":
      item.status = "ready";
      item.subscribtion.unsubscribe();
      break;

      case "r":
      let _current = item.current;
      item.subscribtion = item.timer.subscribe(t => {
        item.current = t + _current;
        item.status = "running";
        item.timeSet= this.utilsTimerStringFormat({max: item.max, current: item.current});
        if(item.current >= item.max){
          item.btnStatus = "end";
          this.goTimerAction(item);
        }
      })
      break;

      case "e":
      item.subscribtion.unsubscribe();
      item.status = "complete";
      item.current = 0;
      item.timeSet= this.utilsTimerStringFormat({max: item.max, current: item.current});
      break;
    }
  }

  startAlram(){

  }

  goLoginPage(): void{
    this.navCtrl.push(LoginPage);
  }

  goLogout(): void{
    this.loginService.serviceLogout()
    .then((res) =>{
      this.showAlert({titleCode: "Common.AlertTitle.Information", messageObj: "Login.Alert.LogoutMessage"});
    })
    .catch((err)=>{
      console.log(err);
      this.showAlert({titleCode: "Common.AlertTitle.Error", messageObj: "Login.Alert.LogoutErrorMessage"});
    })
  }

  onEnableSimple(){
    console.log('onEnableSimpleView', this.timer.simple);
  }

  showAlert({titleCode, messageObj}) {
    let title, message, btnConfirm: string;

    this.translate.get(titleCode)
    .subscribe((res: string) => {
      title = res;
    })

    if(typeof messageObj == 'string'){
      this.translate.get(messageObj)
      .subscribe((res: string) => {
        message = res;
      })
    }else{
      this.translate.get("FirebaseMessage." + messageObj.code)
      .subscribe((res: string) => {
        message = res.match("FirebaseMessage.")? messageObj.message : res;
      })
    }

    this.translate.get('Common.Confirm')
    .subscribe((res: string) => {
      btnConfirm = res;
    })

    let alert = this.alertCtrl.create({
      title: title,
      subTitle: message,
      buttons: [{
        text: btnConfirm,
        handler: () => {
          console.log('Confirm clicked');
        }
      }]
    });

    alert.present();
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


  onDecrease(){
    if(this.timer.repeat> 0){
      this.timer.repeat-=1;
    }
  }

  onIncrease(){
    if(this.timer.repeat< 10){
      this.timer.repeat+=1;
    }
  }

  onDetailMode(){
    this.detailMode = this.detailMode?false:true;
    if(this.detailMode){
      this.detailShown = 'shown';
    }else{
      this.detailShown = 'hidden';
    }
  }
}
