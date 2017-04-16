import { Component, OnInit } from '@angular/core';

import { NavController, AlertController } from 'ionic-angular';

// services
import { LoginService } from '../../services/login-service';

// utils
import { TranslateService } from '@ngx-translate/core';
import * as humanizeDuration from 'humanize-duration';
import * as moment from 'moment';

import {Observable} from 'rxjs/Rx';

// pages
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-home',
  providers: [LoginService],
  templateUrl: 'home.html'
})
export class HomePage {
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

  timer: any;
  subscribtion: any;

  shortEnglishHumanizer = humanizeDuration.humanizer({
    language: 'shortEn',
    languages: {
      shortEn: {
        y: function() { return 'y' },
        mo: function() { return 'mo' },
        w: function() { return 'w' },
        d: function() { return 'd' },
        h: function() { return ':' },
        m: function() { return ':' },
        s: function() { return '' },
        ms: function() { return 'ms' },
      }
    }
  })

  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public translate: TranslateService,
    public loginService: LoginService
  ) {
    this.timer = Observable.timer(0, 1000);
  }

  ngOnInit() {
    this.setTimer({day:0, hour:0, minunt:1, seconds:50});
  }

  goIncrease():void{
    this.current+=1;
  }

  goDecrease():void{
    this.current-=1;
  }

  getMax():number{

    return 0;
  }

  getTimeStringFormat(): string{

    return "";
  }

  setTimer({day, hour, minunt, seconds}){
    let _day:number = day ;
    let _hour:number = hour;
    let _minunt:number = minunt;
    let _seconds:number = seconds;

    let convertSeconds = (_day * 24 * 60 * 60) + (_hour * 60 * 60) + (_minunt * 60) + _seconds;

    this.max = convertSeconds;
    this.current = 0;

    this.timerString = this.shortEnglishHumanizer(convertSeconds * 1000).replace(/,| /gi,'');
  }

  goTimerAction(status){
    // let timer = this.timer;

    switch(status){
      case "start":
      this.timerAction({timer:this.timer, status: "s"});
      this.btnState = "pause";
      break;

      case "pause":
      this.timerAction({timer:this.timer, status: "p"});
      this.btnState = "resume";
      break;

      case "resume":
      this.timerAction({timer:this.timer, status: "r"});
      this.btnState = "pause";
      break;

      case "end":
      this.timerAction({timer:this.timer, status: "e"});
      this.btnState = "start";
      break;
    }
  }

  timerAction({timer, status}){
    switch(status){
      case "s":
      this.subscribtion = timer.subscribe(t => {
      this.current = t;
      this.timerString = this.shortEnglishHumanizer(this.max * 1000 - this.current * 1000).replace(/,| /gi,'');
      if(this.current == this.max){
        // this.subscribtion.unsubscribe();
        this.goTimerAction("end");
      }
      })
      break;

      case "p":
      this.subscribtion.unsubscribe();
      break;

      case "r":
      let _current = this.current;
      this.subscribtion = timer.subscribe(t => {
      this.current = t + _current;
      this.timerString = this.shortEnglishHumanizer(this.max * 1000 - this.current * 1000).replace(/,| /gi,'');
      if(this.current == this.max){
        this.goTimerAction("end");
        // this.subscribtion.unsubscribe();
      }
      })
      break;

      case "e":
      this.subscribtion.unsubscribe();
      this.current = 0;
      this.timerString = this.shortEnglishHumanizer(this.max * 1000 - this.current * 1000).replace(/,| /gi,'');
      break;
    }

  }


  goTimerReset(){
    this.goTimerAction("end");
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
