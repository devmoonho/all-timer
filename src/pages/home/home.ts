import { Component, ViewChild } from '@angular/core';

import { Content, NavController, AlertController } from 'ionic-angular';

// services
import { LoginService } from '../../services/login-service';

// utils
import { BackgroundMode } from '@ionic-native/background-mode';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';

import { Observable } from 'rxjs/Rx';
import { DatePicker } from '@ionic-native/date-picker';

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
  callbackExcuteFlow: any = '';

  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public translate: TranslateService,
    public loginService: LoginService,
    public backgroundMode: BackgroundMode,
    public datePicker: DatePicker,
  ) {
    // this.timer = Observable.timer(0, 1000);
  }

  ngOnInit() {
    this.setTimer({day:0, hour:0, minunt:1, seconds:30});

    this.timerList = [{
      title:'title #1',
      timer: Observable.timer(0, 1000),
      subscribtion: null,
      current: 0,
      max:0,
      timeSet:'00:00:10',
      status: 'ready',
      btnStatus: 'start',
      detail:  "aute veniam veniam dolor duis illum multos quid fore esse noster quae quorum elit aute amet summis summis labore quae culpa illum amet fore sunt quem fugiat elit tempor export",
      order: 2,
      alram: true,
      backgroundImage: "",
      color:"#E91E63",
    },{
      title:'title #2',
      timer: Observable.timer(0, 1000),
      subscribtion: null,
      current: 0,
      max:0,
      timeSet:'00:00:10',
      status: 'ready',
      btnStatus: 'start',
      detail:  "aute veniam veniam dolor duis illum multos quid fore esse noster quae quorum elit aute amet summis summis labore quae culpa illum amet fore sunt quem fugiat elit tempor export",
      order:1,
      alram: false,
      backgroundImage: '',
      color:"#9C27B0",
    },{
      title:'title #3',
      timer: Observable.timer(0, 1000),
      subscribtion: null,
      current: 0,
      max:0,
      timeSet:'00:0:10',
      status: 'ready',
      btnStatus: 'start',
      detail:  "aute veniam veniam dolor duis illum multos quid fore esse noster quae quorum elit aute amet summis summis labore quae culpa illum amet fore sunt quem fugiat elit tempor export",
      order:3,
      alram: true,
      backgroundImage: '',
      color:"#009688",
    }]

    this.timerList .forEach((el) => {
      el.max = this.getMax(el.timeSet)
    });

    this.timerList.sort(function(a, b){return a.order - b.order});
  }

  goIncrease():void{
    // this.current+=1;
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

  goStartFlow(){
    this.loop(this.timerList.length, this.currentPosition, (results)=>{
      this.callbackExcuteFlow = '';
      this.currentPosition = 0 ;
      console.log(results)
    })
  }

  loop (max, currentPosition, done) {
    // Recursion base-case
    if (this.currentPosition >= max) return done(this.currentPosition)

    this.asyncTimerActions((res) => {
      this.currentPosition +=1
      this.loop(max, this.currentPosition, done)
    })
  }

  asyncTimerActions(cb): any{
    let yOffset = document.getElementById('timerId_' + this.currentPosition).offsetTop;
    this.callbackExcuteFlow = cb;
    this.content.scrollTo(0, yOffset - 10, 1000)
    this.goTimerAction(this.timerList[this.currentPosition]);
  }

  getMax(timeSet: string):number{
    let day:number = 0;
    let hour:number = moment(timeSet, "HH:mm:ss").hour();
    let minunt:number = moment(timeSet, "HH:mm:ss").minute();
    let seconds:number = moment(timeSet, "HH:mm:ss").second();
    return this.utilsConvertSecond({day, hour, minunt, seconds});
  }

  onChangeTimeSet(timeSet:string): void{
    console.log(timeSet);
    let _hour:number = moment(timeSet, "HH:mm:ss").hour();
    let _minunt:number = moment(timeSet, "HH:mm:ss").minute();
    let _seconds:number = moment(timeSet, "HH:mm:ss").second();

    this.setTimer({day: 0, hour:_hour, minunt: _minunt, seconds: _seconds})
  }

  setTimer({day, hour, minunt, seconds}){
    let convertSeconds = this.utilsConvertSecond({day, hour, minunt, seconds});
    this.max = convertSeconds;
    this.current = 0;
    this.timerString = this.utilsTimerStringFormat({max: this.max, current: this.current});
  }

  utilsTimerStringFormat({max, current}):string{
    let timerVar = max - current;
    return moment().startOf('day').seconds(timerVar).format('HH:mm:ss');
  }

  utilsConvertSecond({day, hour, minunt, seconds}):number{
    return (day * 24 * 60 * 60) + (hour * 60 * 60) + (minunt * 60) + seconds;
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
      if (this.callbackExcuteFlow!= '') this.callbackExcuteFlow(this.currentPosition);
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
      this.backgroundMode.enable();
      break;

      case "p":
      item.status = "ready";
      item.subscribtion.unsubscribe();
      this.backgroundMode.disable();
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
      this.backgroundMode.enable();
      break;

      case "e":
      item.subscribtion.unsubscribe();
      item.status = "complete";
      item.current = 0;
      item.timeSet= this.utilsTimerStringFormat({max: item.max, current: item.current});
      this.backgroundMode.disable();
      break;
    }
  }

  goTimerReset(){
    this.goTimerAction("end");
    this.backgroundMode.disable();
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
