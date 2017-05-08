// Core
import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// App
import { MyApp } from './app.component';

// Pipe
import { CategoryPipe } from '../pipes/category-pipe';
import { PlaceholderPipe } from '../pipes/placeholder-pipe';

// Pages
import { TabsPage } from '../pages/tabs/tabs';
import { StartPage } from '../pages/start/start';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { SignupPage } from '../pages/signup/signup';
import { StorePage } from '../pages/store/store';
import { TimerPage } from '../pages/timer/timer';
import { TimerListPage } from '../pages/timer-list/timer-list';
import { TimerEditorPage } from '../pages/timer-editor/timer-editor';

// Modals
import { ColorPickerModal } from '../modals/color-picker/color-picker';

// services
import { LoginService } from '../services/login-service';
import { TimerService } from '../services/timer-service';
import { StorageService } from '../services/storage-service';
import { Globals } from './globals';
import { Config } from './config';

// Utils
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule, Http } from '@angular/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { IonicStorageModule } from '@ionic/storage';

import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { TranslateService } from '@ngx-translate/core';
import { Keyboard } from '@ionic-native/keyboard';
import { Globalization } from '@ionic-native/globalization';
import { Device } from '@ionic-native/device';

import { Firebase } from '@ionic-native/firebase';

import { RoundProgressModule } from 'angular-svg-round-progressbar';
import { BackgroundMode } from '@ionic-native/background-mode';
import { DatePicker } from '@ionic-native/date-picker';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { UUID } from 'angular2-uuid';

import { SuperTabsModule } from 'ionic2-super-tabs';
import { NativeAudio } from '@ionic-native/native-audio';
import { ImagePicker } from '@ionic-native/image-picker';
import { Network } from '@ionic-native/network';
import { Vibration } from '@ionic-native/vibration';

export function createTranslateLoader(http: Http) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    TabsPage,
    StartPage,
    LoginPage,
    SignupPage,
    StorePage,
    TimerPage,
    TimerListPage,
    TimerEditorPage,
    CategoryPipe,
    PlaceholderPipe,
    ColorPickerModal,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    IonicModule.forRoot(MyApp, {
      platforms : {
        ios : {
          scrollAssist: true,
          autoFocusAssist: true}
        }
      }),
    IonicStorageModule.forRoot(),
    HttpModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [Http]
      }
    }),
    RoundProgressModule,
    SuperTabsModule.forRoot(),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    TabsPage,
    StartPage,
    LoginPage,
    SignupPage,
    StorePage,
    TimerPage,
    TimerListPage,
    TimerEditorPage,
    ColorPickerModal,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    LoginService,
    TimerService,
    StorageService,
    Globals,
    Config,
    ScreenOrientation,
    TranslateService,
    Keyboard,
    Globalization,
    Firebase,
    BackgroundMode,
    DatePicker,
    LocalNotifications,
    Device,
    UUID,
    NativeAudio,
    ImagePicker,
    Network,
    Vibration,
  ]
})
export class AppModule {}
