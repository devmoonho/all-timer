import { Component } from '@angular/core';
import { NavController, NavParams, Events, AlertController, LoadingController } from 'ionic-angular';
import { UUID } from 'angular2-uuid';
import { Observable } from 'rxjs/Rx';

// animatin
import { trigger, state, style, transition, animate, keyframes} from '@angular/core'

// services
import { ShareService } from '../../services/share-service';
import { StorageService } from '../../services/storage-service';
import { TimerService } from '../../services/timer-service';
import { Config } from '../../app/config';

// pipe
import { CategoryPipe } from '../../pipes/category-pipe';

// pages
import { TimerPage } from '../timer/timer';
import { TimerEditorPage } from '../timer-editor/timer-editor';

// utils
import { TranslateService } from '@ngx-translate/core';
import { AdMob } from '@ionic-native/admob';

@Component({
  selector: 'page-timer-list',
  providers:[TimerService, ShareService],
  templateUrl: 'timer-list.html',
})

export class TimerListPage {
  rootNavCtrl: NavController;
  categoryView: string  = 'shown';
  categoryDetail: string  = 'hidden';

  categoryMode: any = true;
  currentCategory: any;

  timerList: any=[];

  selectedTimer: any;

  loader: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public shareService: ShareService,
    public storageService: StorageService,
    public timerService: TimerService,
    public config: Config,
    public events: Events,
    public translate: TranslateService,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public admob: AdMob,
  ){
    this.rootNavCtrl = navParams.get('rootNavCtrl');

    events.subscribe('timer:update-list', (category) => {
      console.log('timer:update-list');
      this.updateTimerList(category);
    });

    events.subscribe('timer:remove-list', (category) => {
      console.log('timer:remove-list');
      this.updateTimerList(category);
    });
  }

  ngOnInit(){
    this.currentCategory = this.navParams.get('category');
    this.updateTimerList(this.currentCategory.value);
  }

  ionViewWillEnter(){
    this.currentCategory = this.navParams.get('category');
    this.updateTimerList(this.currentCategory.value);
  }

  getRandomColor(index: number): string {
    let idx = (index) % this.config.RANDOM_COLOR.length
    return this.config.RANDOM_COLOR[idx];
  }

  shareTimer(timer){
    this.shareService.serviceUploadTimer(timer)
    .then((res)=>{
      this.loader.dismiss();
      console.log('shareTimer', res);
    });
  }

  onBackCategory(){
    this.navCtrl.pop();
  }

  onCreateTimer(){
    this.navCtrl.push(TimerEditorPage, {
      mode: 'create',
      timer: '',
      category: this.currentCategory,
    });
  }

  onSelectTimer(_timer){
    this.navCtrl.push(TimerPage, {
      mode: 'edit',
      timer: _timer,
      category: this.currentCategory,
    });
  }

  updateTimerList(category){
    this.currentCategory = this.getCategoryByValue(category);
    this.storageService.serviceGetCategoryTimer(category)
    .then((res)=>{
      // this.timerList = res;
      this.timerList = this.utilsObjectToArray(res);
    })
  }

  getCategoryByValue(_value){
    for(let obj of this.config.CATETGORY){
      if(_value === obj.value){
        return obj;
      }
    }
    return this.currentCategory;
  }

  utilsArrayToObject(arr){
    let _obj:any = {};
    for(let item of arr){
      item.id = UUID.UUID();
      _obj[item.id] = item;
    }
    return _obj;
  }

  utilsObjectToArray(obj){
    return Object.keys(obj).map((k) => obj[k])
  }

  showShareConfirm(event: Event, timer) {
    event.stopPropagation();

    let englishDefault = {title:'Share this Timer', message:'Do you agree to share this timer?', btnAgree:'Agree', btnDisagree:'Disagree'}
    let title, message, btnAgree, btnDisagree: string = '';

    this.translate.get('Common.AlertTitle.Information').subscribe((res)=>{title = res});
    this.translate.get('MobileMessage.ShareTimer').subscribe((res)=>{message= res});
    this.translate.get('Common.Agree').subscribe((res)=>{btnAgree= res});
    this.translate.get('Common.Disagree').subscribe((res)=>{btnDisagree= res});

    let confirm = this.alertCtrl.create({
      title: title==''?englishDefault.title:title,
      message: message==''?englishDefault.message:message,
      buttons: [
        {
          text: btnDisagree==''?englishDefault.btnDisagree:btnDisagree,
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: btnAgree==''?englishDefault.btnAgree:btnAgree,
          handler: () => {
            console.log('Agree clicked');
            this.shareTimer(timer);
            this.presentLoading();
          }
        }
      ]
    });
    confirm.present();
  }

  presentLoading() {
    let englishDefault = 'Please wait...'
    let msg: string = '';
    this.translate.get('MobileMessage.Wait').subscribe((res)=>{msg = res});
    this.loader = this.loadingCtrl.create({
      content: msg ==''?englishDefault:msg,
    });
    this.loader.present();
  }
}
