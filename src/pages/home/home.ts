import { Component, ViewChild, ElementRef } from '@angular/core';

import { Content, NavController, AlertController } from 'ionic-angular';

// services
import { LoginService } from '../../services/login-service';

// utils
import { BackgroundMode } from '@ionic-native/background-mode';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';

import { Observable } from 'rxjs/Rx';
import { DatePicker } from '@ionic-native/date-picker';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { Device } from '@ionic-native/device';
import { UUID } from 'angular2-uuid';

// pages
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-home',
  providers: [LoginService],
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild(Content) content: Content;

  counter: number = 0;
  current: number = 0;
  max: number = 0;
  stroke: number = 15;
  radius: number = 100;
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
  timerList: any;

  currentPosition: number = 0;
  nextTimerPosition: number = -1;
  callbackContinuousTimer: any = '';

  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public translate: TranslateService,
    public loginService: LoginService,
    public backgroundMode: BackgroundMode,
    public datePicker: DatePicker,
    public localNotifications: LocalNotifications,
    public elRef: ElementRef,
    public device: Device,
  ) {
    // this.timer = Observable.timer(0, 1000);
  }

  ngOnInit() {
    this.timerList = [{
      id: UUID.UUID(),
      title:'title #1',
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
      notification:{
        enable:true,
        id: 1,
        title:'',
        text:'',
        sound:'',
        data:''
      },
      backgroundImage: "",
      color:"#E91E63",
    },{
      id: UUID.UUID(),
      title:'title #2',
      timer: Observable.timer(0, 1000),
      subscribtion: null,
      current: 0,
      max:0,
      defaultTimeSet:'00:00:08',
      timeSet:'00:00:08',
      status: 'ready',
      btnStatus: 'start',
      detail:  "aute veniam veniam dolor duis illum multos quid fore esse noster quae quorum elit aute amet summis summis labore quae culpa illum amet fore sunt quem fugiat elit tempor export",
      order:1,
      notification:{
        enable:false,
        id: 1,
        title:'',
        text:'',
        sound:'',
        data:''
      },
      backgroundImage: '',
      color:"#9C27B0",
    },{
      id: UUID.UUID(),
      title:'title #3',
      timer: Observable.timer(0, 1000),
      subscribtion: null,
      current: 0,
      max:0,
      defaultTimeSet:'00:00:05',
      timeSet:'00:00:05',
      status: 'ready',
      btnStatus: 'start',
      detail:  "aute veniam veniam dolor duis illum multos quid fore esse noster quae quorum elit aute amet summis summis labore quae culpa illum amet fore sunt quem fugiat elit tempor export",
      order:3,
      notification:{
        enable:true,
        id: 1,
        title:'',
        text:'',
        sound:'',
        data:''
      },
      backgroundImage: '',
      color:"#009688",
    },{
      id: UUID.UUID(),
      title:'title #4',
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
      notification:{
        enable:false,
        id: 1,
        title:'',
        text:'',
        sound:'',
        data:''
      },
      backgroundImage: '',
      color:"#00B0FF",
    }
  ]

    this.initTimer();
  }

  popLocalNotifications(timer){
    console.log('pop notification');
    this.localNotifications.schedule({
      id: 1,
      title:'Single Title',
      text: 'Single ILocalNotification'
    });
  }

  toggleNotification(timer){
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

  getCurrentContinuousTimer(): any{
      return this.timerList[this.currentPosition];
  }

  stopContinuousTimer(){
    this.callbackContinuousTimer = '';
    this.currentPosition = 0 ;
  }

  getPosition(timer): number{
    let cnt = 0;
    for (let _timer of this.timerList) {
        if(_timer.id === timer.id){
          return cnt;
        }
      cnt += 1;
    }
    return -1;
  }

  resetTimer(timer){
    timer.timeSet = timer.defaultTimeSet;
    let day:number = 0;
    let hour:number = moment(timer.timeSet, "HH:mm:ss").hour();
    let minunt:number = moment(timer.timeSet, "HH:mm:ss").minute();
    let seconds:number = moment(timer.timeSet, "HH:mm:ss").second();
    this.setTimer({timer, day, hour, minunt, seconds})
  }

  setCurrentTimer(timer){
    this.currentPosition = this.nextTimerPosition = this.getPosition(timer);
  }

  initTimer(){
    this.timerList .forEach((el) => {
      el.max = this.getMax(el.timeSet)
    });
    this.timerList.sort(function(a, b){return a.order - b.order});
  }

  goStartFlow(){
    // this.setCurrentMode('continue');
    this.loop(this.timerList.length, this.currentPosition, (results)=>{
      this.stopContinuousTimer();
    })
  }

  loop (max, currentPosition, done) {
    // Recursion base-case
    if (this.currentPosition >= max) return done(this.currentPosition)

    this.asyncTimerActions((res) => {
      let currentTimer = this.getCurrentContinuousTimer();
      if(currentTimer.notification.enable) {this.popLocalNotifications(currentTimer)}

      if(this.nextTimerPosition == -1){
        this.currentPosition +=1
      }else{
        this.currentPosition = this.nextTimerPosition;
        this.nextTimerPosition = -1;
      }
      this.loop(max, this.currentPosition, done)
    })
  }

  asyncTimerActions(cb): any{
    let doc:any = document;
    let yOffset = doc.getElementById('timerId_' + this.getCurrentContinuousTimer().id).offsetTop;

    this.callbackContinuousTimer = cb;
    this.content.scrollTo(0, yOffset - 10, 1000)

    if(this.getCurrentContinuousTimer().status != 'running'){
      this.goTimerAction(this.getCurrentContinuousTimer());
    }
  }

  getMax(timeSet: string):number{
    let day:number = 0;
    let hour:number = moment(timeSet, "HH:mm:ss").hour();
    let minunt:number = moment(timeSet, "HH:mm:ss").minute();
    let seconds:number = moment(timeSet, "HH:mm:ss").second();
    return this.utilsConvertSecond({day, hour, minunt, seconds});
  }

  onCancelTimeSet(item:any){
  }

  onChangeTimeSet(item:any): void{
    item.defaultTimeSet = item.timeSet;
    let day:number = 0;
    let hour:number = moment(item.timeSet, "HH:mm:ss").hour();
    let minunt:number = moment(item.timeSet, "HH:mm:ss").minute();
    let seconds:number = moment(item.timeSet, "HH:mm:ss").second();

    this.setTimer({timer: item, day, hour, minunt, seconds})
  }

  setTimer({timer, day, hour, minunt, seconds}){
    let convertSeconds = this.utilsConvertSecond({day, hour, minunt, seconds});
    timer.max = convertSeconds;
    timer.current = 0;

    if(timer.status == 'running'){
      timer.btnStatus = 'pause';
      this.goTimerAction(timer)
    }
  }

  utilsTimerStringFormat({max, current}):string{
    let timerVar = max - current;
    return moment().startOf('day').seconds(timerVar).format('HH:mm:ss');
  }

  utilsConvertSecond({day, hour, minunt, seconds}):number{
    return (day * 24 * 60 * 60) + (hour * 60 * 60) + (minunt * 60) + seconds;
  }

  utilsBackGroundMode(enable: boolean){
    if(this.device.uuid != null){
      if(enable){
        this.backgroundMode.isEnabled() ? {} : this.backgroundMode.enable();
        console.log('enabled backgroundMode');
      }else{
        this.backgroundMode.isEnabled() ? this.backgroundMode.disable() : {};
        console.log('disabled backgroundMode');
      }
    }
  }

  utilsIsRunningTimer(): boolean{
    for(let timer of this.timerList){
      if(timer.status == 'running'){ return true; }
    }
    return false;
  }

  goTimerAction(item){
    switch(item.btnStatus){
      case "start":
      this.timerAction({item, status: "s"});
      item.btnStatus= "pause";
      break;

      case "pause":
      this.timerAction({item, status: "p"});
      item.btnStatus = "resume";
      break;

      case "resume":
      this.timerAction({item, status: "r"});
      item.btnStatus = "pause";
      break;

      case "end":
      this.timerAction({item, status: "e"});
      item.btnStatus = "start";
      if (this.callbackContinuousTimer!= '') {this.callbackContinuousTimer(this.currentPosition)};
    }
  }

  timerAction({item, status}){
    switch(status){
      case "s":
      item.subscribtion = item.timer.subscribe(t => {
        item.current = t;
        item.status = "running";
        item.timeSet = this.utilsTimerStringFormat({max: item.max, current: item.current});
        if(item.current >= item.max){
          item.btnStatus = "end";
          this.goTimerAction(item);
        }
      })
      // this.utilsBackGroundMode(true);
      break;

      case "p":
      item.status = "ready";
      item.subscribtion.unsubscribe();
      // this.utilsBackGroundMode(false);
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
      // this.utilsBackGroundMode(true);
      break;

      case "e":
      item.subscribtion.unsubscribe();
      item.status = "complete";
      item.current = 0;
      item.timeSet= this.utilsTimerStringFormat({max: item.max, current: item.current});
      // this.utilsBackGroundMode(false);
      break;
    }
    this.utilsIsRunningTimer() ? this.utilsBackGroundMode(true) : this.utilsBackGroundMode(false);
  }

  goTimerReset(){
    this.popLocalNotifications(null);
    // this.goTimerAction("end");
    // this.backgroundMode.disable();
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
}
