import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { Platform, Nav, AlertController, Events } from 'ionic-angular';
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
    public events: Events,
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
      }
      this.initNetwork();
    });//platform.ready()

  }

  initNetwork(){
    let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
      console.log('network was disconnected :-(', this.network.type);
      this.events.publish('network:disconnected');
    });
    // stop disconnect watch
    // disconnectSubscription.unsubscribe();

    let connectSubscription = this.network.onConnect().subscribe(() => {
      console.log('network connected!', this.network.type); 
      this.events.publish('network:connected');
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
      // this.translate.use('ko');
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
          this.loadingProcess();
        }
      });
    });
  }

  private loadingProcess(){
    this.zone.run(() => {
      let _timer:any;
      let _items:any;

      Promise.resolve()
      .then(()=>{
        return this.isFirstAccess();
      })
      .then((res:any)=>{
        if(res.val()===null){
          console.log('first access')
          return this.loadTemplateTimerFromServer()
          .then((res:any)=>{
            _timer = res.val();
            return this.loadTemplateItemsFromServer();
          })
          .then((res:any)=>{
            _items = res.val();
            return this.copyDefaultTimer(_timer, _items);
          })
          .then(()=>{
            console.log('#end')
            return this.loadTimerDataFromServer();
          })
        }else{
          console.log('not first access')
          return this.loadTimerDataFromServer();
        }
      })
      .then((res:any)=>{
        this.config.MY_TIMER = res.val();
        return this.loadCategoryDataFromServer();
      })
      .then((res:any)=>{
        console.log('#end',res.val())
        this.config.CATETGORY = res.val();
        this.events.publish('timer:update-list');
        this.rootPage = HomePage;
      })
    })
  }

  private isFirstAccess(){
    let user = firebase.auth().currentUser;
    return firebase.database().ref(this.globals.SERVER_PATH_USERS + user.uid ).once('value');
  }

  private loadTemplateTimerFromServer(): any{
    console.log('#1')
    return firebase.database().ref(this.globals.SERVER_PATH_APP + this.globals.SERVER_PATH_TIMER_TEMPLATE ).once('value')
  }

  private loadTemplateItemsFromServer(): any{
    console.log('#2')
    return firebase.database().ref(this.globals.SERVER_PATH_APP + this.globals.SERVER_PATH_TIMER_TEMPLATE_ITEMS ).once('value')
  }

  private copyDefaultTimer(_timer, _items): any{
    console.log('#3', _timer, _items);
    let user = firebase.auth().currentUser;
    let ref = firebase.database().ref(this.globals.SERVER_PATH_USERS +  user.uid + this.globals.SERVER_PATH_TIMER);
    let newPostTimerKey = ref.push().key;
    let newPostItemsKey = ref.push().key;

    let updates = {};
    let timerItems = {};

    _items['id'] = newPostItemsKey;
    timerItems[newPostItemsKey] = _items;
    _timer['timerItems'] = timerItems;
    _timer['timerId'] = newPostTimerKey;

    _timer = this.defaultDataForFirstAccess(_timer);

    // first default timer
    updates[newPostTimerKey] = _timer;
    return ref.update(updates);
  }

  private defaultDataForFirstAccess(_timer): any{
    let englishDefault:any ={
      name:"Super Timer",
      summary:"This is a sample timer",
      title:"Timer #1",
      detail:"This is first timer, Let's set time"
    }

    this.translate.get('Default.Timer.Name')
    .subscribe((res: string) => {
      if(res === 'Default.Timer.Name'){
        _timer.name = englishDefault.name;
      }else{
        _timer.name = res;
      }
    })
    this.translate.get('Default.Timer.Summary')
    .subscribe((res: string) => {
      if(res === 'Default.Timer.Summary'){
        _timer.summary = englishDefault.summary;
      }else{
        _timer.summary = res;
      }
    })
    this.translate.get('Default.Timer.Title')
    .subscribe((res: string) => {
      if(res === 'Default.Timer.Title'){
        for(let key in _timer.timerItems){
          _timer.timerItems[key]['title'] = englishDefault.title;
        }
      }else{
        for(let key in _timer.timerItems){
          _timer.timerItems[key]['title'] = res;
        }
      }

    })
    this.translate.get('Default.Timer.detail')
    .subscribe((res: string) => {
      if(res === 'Default.Timer.detail'){
        for(let key in _timer.timerItems){
          _timer.timerItems[key]['detail'] = englishDefault.detail;
        }
      }else{
        for(let key in _timer.timerItems){
          _timer.timerItems[key]['detail'] = res;
        }
      }
    })

    return _timer;
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
