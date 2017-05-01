import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { Platform, Nav, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Keyboard } from '@ionic-native/keyboard';
import { Globalization } from '@ionic-native/globalization';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { Device } from '@ionic-native/device';

import { Globals } from './globals';
import { Config } from './config';

// page
import { StartPage } from '../pages/start/start';
import { HomePage } from '../pages/home/home';
import { StorePage } from '../pages/store/store';
import { LoginPage } from '../pages/login/login';

// utils
import { TranslateService } from '@ngx-translate/core';
import * as firebase from 'firebase';
import * as moment from 'moment';
import { Firebase } from '@ionic-native/firebase';
import { Network } from '@ionic-native/network';

// services

@Component({
  templateUrl: 'app.html',
})
export class MyApp implements OnInit{
  @ViewChild(Nav) nav: Nav;

  rootPage: any = null;
  rootParams: any;
  zone: NgZone;

  menuItems: any[] = [
    {
      name: 'Full page',
      page: LoginPage,
      params: { icons: true, titles: true, pageTitle: 'Full page' }
    },
    {
      name: 'Full - Title only',
      page: LoginPage,
      params: { icons: false, titles: true }
    },
    {
      name: 'Full - Icons only',
      page: LoginPage,
      params: { icons: true, titles: false }
    },
    {
      name: 'Partial nav',
      page: LoginPage,
      params: { icons: true, titles: true }
    },
    {
      name: 'Partial - Title only',
      page: LoginPage,
      params: { icons: false, titles: true }
    },
    {
      name: 'Partial - Icons only',
      page: StorePage,
      params: { icons: true, titles: false }
    }
  ];

  constructor(public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public globals: Globals,
    public config: Config,
    public alertCtrl: AlertController,
    public screenOrientation: ScreenOrientation,
    public translate: TranslateService,
    public globalization: Globalization,
    public keyboard: Keyboard,
    public cordovaFirebase: Firebase,
    public device: Device,
    public network: Network,
  ){
    translate.addLangs(["en", "ko"]);
    translate.setDefaultLang('en');
    this.initFirebase();

    platform.ready()
    .then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

      if (platform.is('ios')) {
        keyboard.disableScroll(true);
        keyboard.hideKeyboardAccessoryBar(false);
      }

      // real device case
      if(this.device.uuid != null){
        screenOrientation.lock('portrait');
        this.initGlobalization();
        this.initNavFirebase();
        this.initNetwork();
      }
    });//platform.ready()
  }

  initNetwork(){
    let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
      console.log('network was disconnected :-(');
    });
    // stop disconnect watch
    // disconnectSubscription.unsubscribe();

    let connectSubscription = this.network.onConnect().subscribe(() => {
      console.log('network connected!'); 
      setTimeout(() => {
        if (this.network.type === 'wifi') {
          console.log('we got a wifi connection, woohoo!');
        }
      }, 3000);
    });
    // stop connect watch
    // connectSubscription.unsubscribe();
  }

  initFirebase(){
    firebase.initializeApp(this.globals.FIREBASE_CONFIG);
    this.zone = new NgZone({});
  }

  initNavFirebase(){
    this.cordovaFirebase.grantPermission();
    this.cordovaFirebase.onNotificationOpen()
    .subscribe((res)=>{
        console.log(res);
        let message: any;

        if (this.platform.is('ios')) {
            message = res.aps.alert;
        }
        else{
            message = res.body;
        }

        if (message.replace(/ /g,'') == ''){
          return ;
        }

        let alert = this.alertCtrl.create({
          title: 'All timer',
          subTitle: message,
          buttons: [{
            text: "OK",
            handler: () => {
              // console.log('Confirm clicked');
            }
          }]
        });
        alert.present();
    })
  }

  initGlobalization(){    // config translate
    this.globalization.getPreferredLanguage()
    .then((res) => {
      let userLang = res.value.split('-')[0];
      userLang = /(en|ko)/gi.test(userLang) ? userLang : 'en';
      this.translate.use(userLang);
    })
  }

  ngOnInit() {
    firebase.auth().onAuthStateChanged((user) => {
      this.zone.run(() => {
        if (!user) {
          console.log("No user is signed in.")
          this.rootPage = StartPage ;
        } else {
          console.log(user)
          // this.rootPage = HomePage;
          this.updateConfig();
          this.updateLastConnection()
        }
      });
    });
  }

  private updateConfig(){
    let user = firebase.auth().currentUser;

    return Promise.resolve()
    .then(()=>{
      if(!user){
        return;
      }else{
        return this.loadTimerDataFromServer();
      }
    })
    .then((res)=>{
      let _res:any = res;
      if(!_res){
        this.config.MY_TIMER = this.config.DEFAULT_TIMER;
      }else{
        this.config.MY_TIMER = _res.val();
      }
      return this.loadTimerTemplateDataFromServer()
    })
    .then((res)=>{
      let _res:any = res;
      this.config.TEMP_TIMER = _res.val();
      return this.loadCategoryDataFromServer();
    })
    .then((res)=>{
      let _res:any = res;
      this.config.CATETGORY= _res.val();
      return ;
    })
    .then(()=>{
      this.rootPage = HomePage;
      console.log("---- updateConfig done ----");
    });
  }

  private anonymousLogin(){

  }

  private checkNetworkAvaiable(){

  }

  private loadCategoryDataFromServer(){
    return firebase.database().ref(this.globals.SERVER_PATH_APP + this.globals.SERVER_PATH_TIMER_CATEGORY).once('value')
  }

  private loadTimerTemplateDataFromServer(){
    return firebase.database().ref(this.globals.SERVER_PATH_APP + this.globals.SERVER_PATH_TIMER_TEMPLATE).once('value')
  }

  private loadTimerDataFromServer(){
    let user = firebase.auth().currentUser;
    return firebase.database().ref(this.globals.SERVER_PATH_USERS + user.uid + this.globals.SERVER_PATH_TIMER).once('value')
  }

  private updateLastConnection(): void {
    let user = firebase.auth().currentUser;
    firebase.database().ref(this.globals.SERVER_PATH_USERS + user.uid + this.globals.SERVER_PATH_USER_PROFILE).update({
      lastConnect: moment().format('YYYYMMDDHHmmss')
    });
  }

  openPage(page) {
    page.params.pageTitle = page.name;
    this.nav.push(page.page, page.params);
  }
}
