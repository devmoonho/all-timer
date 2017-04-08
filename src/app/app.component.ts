import { Component, OnInit, ViewChild } from '@angular/core';
import { Platform, NavController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Keyboard } from '@ionic-native/keyboard';
import { Globalization } from '@ionic-native/globalization';
import { ScreenOrientation } from '@ionic-native/screen-orientation';

import { Globals } from './globals';

// page
import { StartPage } from '../pages/start/start';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';

// utils
import { TranslateService } from '@ngx-translate/core';
import * as firebase from 'firebase';
import * as moment from 'moment';

@Component({
  providers: [Globals],
  templateUrl: 'app.html'
})
export class MyApp implements OnInit{
  @ViewChild('rootNav') navCtrl: NavController
  rootPage: any;
  globals: any = new Globals();

  constructor(platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    translate: TranslateService
  ){
    // config translate
    translate.addLangs(["en", "ko"]);
    translate.setDefaultLang('en');

    platform.ready()
    .then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

      Globalization.prototype.getPreferredLanguage()
      .then((res) => {
        let userLang = res.value.split('-')[0];
        userLang = /(en|ko)/gi.test(userLang) ? userLang : 'en';
        translate.use(userLang);
      })

      if (platform.is('ios')) {
        Keyboard.prototype.disableScroll(false);
        Keyboard.prototype.hideKeyboardAccessoryBar(false);
      }
      ScreenOrientation.prototype.lock('portrait');


    });//platform.ready()

    // Initialize Firebase
    var config = {
      apiKey: "AIzaSyDEdDmwkxWuyjgrkyPAjKK-YafoahwJAk4",
      authDomain: "all-timer.firebaseapp.com",
      databaseURL: "https://all-timer.firebaseio.com",
      projectId: "all-timer",
      storageBucket: "all-timer.appspot.com",
      messagingSenderId: "902931259626"
    };
    firebase.initializeApp(config);
  }

  ngOnInit() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        console.log(user)
        this.updateLastConnection();
        this.navCtrl.setRoot(HomePage);
      } else {
        this.navCtrl.setRoot(StartPage);
        console.log("No user is signed in.")
      }
    });
  }

  private updateLastConnection(): void {
    let user = firebase.auth().currentUser;
    firebase.database().ref(this.globals.SERVER_PATH_USERS + user.uid + this.globals.SERVER_PATH_USER_PROFILE).update({
      lastConnect: moment().format('YYYYMMDDHHmmss')
    });
  }
}
