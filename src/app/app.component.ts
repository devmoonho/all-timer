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
import { TabsPage } from '../pages/tabs/tabs';
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
import { Storage } from '@ionic/storage';
import { UUID } from 'angular2-uuid';

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
      name: 'clear',
      page: '',
      params: { icons: false, titles: true }
    },
    {
      name: 'Logout',
      page: '',
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
    public storage: Storage,
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
          this.loadingProcessFromLocal();
          // this.loadingProcessFromServer();
        }
      });
    });
  }

  private loadingProcessFromLocal(){
    this.zone.run(() =>{
      Promise.resolve()
      .then(() =>{
        return this.isFirstAccessLocalStorage();
      })
      .then((res)=>{
        if(res===0){ // first access
          return this.makeDefaultTimer();
        }
        return;
      })
      .then((res)=>{
        this.events.publish('timer:update-list');
        this.rootPage = TabsPage;
      })
    })
  }

  private loadingProcessFromServer(){
    this.zone.run(() => {
      let _timer:any;
      let _items:any;

      Promise.resolve()
      .then((res:any)=>{
        return this.loadTemplateTimerFromServer()
        .then((res:any)=>{
          console.log('common#1');
          _timer = res.val();
          this.config.TEMP_TIMER = _timer;
          return this.loadTemplateItemsFromServer();
        })
        .then((res:any)=>{
          console.log('common#2');
          _items = res.val();
          this.config.TEMP_TIMER_ITEMS = _items;
          return this.loadCategoryDataFromServer();
        })
        .then((res:any)=>{
          console.log('common#3');
          this.config.CATETGORY = res.val();
          return this.loadSoundDataFromServer();
        })
        .then((res:any)=>{
          console.log('common#4');
          this.config.SOUND= res.val();
        })
        .then(()=>{
          return this.isFirstAccess();
        })
        .then((res)=>{
          if(res.val()===null){
            console.log('first access')
            return this.copyDefaultTimer(_timer, _items);
          }
          console.log('not first access')
          return;
        })
        .then(()=>{
          console.log('common#4');
          return this.loadTimerDataFromServer();
        })
        .then((res:any)=>{
          this.config.MY_TIMER = res.val();
          this.events.publish('timer:update-list');
          this.rootPage = TabsPage;
        })
      });
    });
  }

  private isFirstAccessLocalStorage():any {
    return this.storage.length();
  }

  private makeDefaultTimer(){
    let firstTimer = {};
    let timerItems = {};
    let newPostTimerKey = UUID.UUID();

    firstTimer[newPostTimerKey]= Object.assign({}, this.config.TEMP_TIMER);
    for(let i=0 ; i<3 ; i++){
      let _items = Object.assign({}, this.config.TEMP_TIMER_ITEMS);
      let newPostItemsKey = UUID.UUID();

      _items['id'] = newPostItemsKey;
      _items['color'] = this.config.RANDOM_COLOR[this.randomRange(0, this.config.RANDOM_COLOR.length-1)];
      timerItems[newPostItemsKey] = _items;
    }
    firstTimer[newPostTimerKey]['timerId'] = newPostTimerKey;
    firstTimer[newPostTimerKey]['timerItems'] = timerItems;

    // firstTimer[newPostTimerKey] = this.defaultDataForFirstAccess(firstTimer[newPostTimerKey]);
    return this.storage.set(newPostTimerKey, this.defaultDataForFirstAccess(firstTimer[newPostTimerKey]));
  }

  private loadTimerDataFromLocalStorage(){
    let _timer = {};
    this.storage.forEach((value, key, iterationNumber) =>{
      _timer[key] = value[key];
    })
    return _timer;
  }

  private isFirstAccess(){
    let user = firebase.auth().currentUser;
    return firebase.database().ref(this.globals.SERVER_PATH_USERS + user.uid ).once('value');
  }

  private loadTemplateTimerFromServer(): any{
    return firebase.database().ref(this.globals.SERVER_PATH_APP + this.globals.SERVER_PATH_TIMER_TEMPLATE ).once('value')
  }

  private loadTemplateItemsFromServer(): any{
    return firebase.database().ref(this.globals.SERVER_PATH_APP + this.globals.SERVER_PATH_TIMER_TEMPLATE_ITEMS ).once('value')
  }

  private copyDefaultTimer(timer, items): any{
    let _timer = Object.assign({}, timer);
    let user = firebase.auth().currentUser;
    let ref = firebase.database().ref(this.globals.SERVER_PATH_USERS +  user.uid + this.globals.SERVER_PATH_TIMER);
    let newPostTimerKey = ref.push().key;

    let updates = {};
    let timerItems = {};

    for(let i=0 ; i<3 ; i++){
      let _items = Object.assign({}, items);
      let newPostItemsKey = ref.push().key;

      _items['id'] = newPostItemsKey;
      _items['color'] = this.config.RANDOM_COLOR[this.randomRange(0, this.config.RANDOM_COLOR.length-1)];
      timerItems[newPostItemsKey] = _items;
    }
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
      title:"Timer",
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
    this.translate.get('Default.Timer.Detail')
    .subscribe((res: string) => {
      if(res === 'Default.Timer.Detail'){
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

  private loadSoundDataFromServer(){
    return firebase.database().ref(this.globals.SERVER_PATH_APP + this.globals.SERVER_PATH_TIMER_SOUND).once('value')
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

  private randomRange(min, max){
    var RandVal = Math.random() * (max- min) + min;
    return Math.floor(RandVal);
  }

  private logout(){
    firebase.auth().signOut();
  }

  openPage(page) {
    if(page.name === 'Logout'){
      this.logout();
    }else if(page.name === 'clear'){
      this.storage.clear();
    }else{
      page.params.pageTitle = page.name;
      this.nav.push(page.page, page.params);
    }
  }
}
