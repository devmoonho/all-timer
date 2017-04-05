// Core
import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';

// App
import { MyApp } from './app.component';

// Pages
import { StartPage } from '../pages/start/start';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';

// services
import { LoginService } from '../services/login-service';
import { Globals } from './globals';

// Utils
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import {HttpModule, Http} from '@angular/http';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';

export function createTranslateLoader(http: Http) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    StartPage,
    LoginPage,
  ],
  imports: [
    IonicModule.forRoot(MyApp, {
      platforms : {
        ios : {
          scrollAssist: false,
          autoFocusAssist: false}
        }
      }),
    HttpModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [Http]
      }
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    StartPage,
    LoginPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    LoginService,
    Globals,
  ]
})
export class AppModule {}
