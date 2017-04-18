import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { Platform, NavController, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Keyboard } from '@ionic-native/keyboard';
import { Globalization } from '@ionic-native/globalization';
import { ScreenOrientation } from '@ionic-native/screen-orientation';

import { Globals } from './globals';

// page
import { StartPage } from '../pages/start/start';
import { HomePage } from '../pages/home/home';

// utils
import { TranslateService } from '@ngx-translate/core';
import * as firebase from 'firebase';
import * as moment from 'moment';
import { Firebase } from '@ionic-native/firebase';

@Component({
  templateUrl: 'app.html'
})
export class MyApp implements OnInit{
  @ViewChild('rootNav') navCtrl: NavController
  rootPage: any = null;
  zone: NgZone;

  constructor(public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public globals: Globals,
    public alertCtrl: AlertController,
    public screenOrientation: ScreenOrientation,
    public translate: TranslateService,
    public globalization: Globalization,
    public keyboard: Keyboard,
    public cordovaFirebase: Firebase
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

      if (platform.is('ios') || platform.is('android')) {
        screenOrientation.lock('portrait');
      }

      this.initGlobalization();
      this.initNavFirebase();
    });//platform.ready()

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
          this.updateLastConnection();
          this.rootPage = HomePage;
        }
      });
    });
  }

  private updateLastConnection(): void {
    let user = firebase.auth().currentUser;
    firebase.database().ref(this.globals.SERVER_PATH_USERS + user.uid + this.globals.SERVER_PATH_USER_PROFILE).update({
      lastConnect: moment().format('YYYYMMDDHHmmss')
    });
  }
}
