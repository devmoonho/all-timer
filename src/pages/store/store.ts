import { Component } from '@angular/core';
import { NavController, NavParams, Events, ModalController, AlertController, LoadingController } from 'ionic-angular';

// services
import { ShareService } from '../../services/share-service';
import { StorageService } from '../../services/storage-service';
import { TimerService } from '../../services/timer-service';
import { Config } from '../../app/config';

// utils
import { UUID } from 'angular2-uuid';
import { TranslateService } from '@ngx-translate/core';

// modals
import { ShareTimerInfoModal } from '../../modals/share-timer-info/share-timer-info'

@Component({
  selector: 'page-store',
  providers:[TimerService, ShareService],
  templateUrl: 'store.html'
})
export class StorePage {

  rootNavCtrl: NavController;
  timerList:any = [];

  searchQuery: any = '';
  timer: any;
  loader: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public shareService: ShareService,
    public timerService: TimerService,
    public config: Config,
    public modalCtrl: ModalController,
    public translate: TranslateService,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public events: Events,
  ) {
    this.rootNavCtrl = navParams.get('rootNavCtrl');
  }

  ngOnInit(){
    this.timerService.serviceShareTimerData()
    .then((res)=>{
      this.timerList = this.utilsObjectToArray(res);
    })
  }

  ionViewDidEnter(){
    this.timerService.serviceShareTimerData()
    .then((res)=>{
      this.timerList = this.utilsObjectToArray(res);
    })
  }

  getItems(event:Events){

  }

  onSelectTimer(_timer){
    let profileModal = this.modalCtrl.create(ShareTimerInfoModal, { timer : _timer});
    profileModal.present();
  }

  search(){
    this.timerService.serviceQueryShareTimerData(this.searchQuery)
    .then((res)=>{
      this.timerList = this.utilsObjectToArray(res);
    })
  }

  getRandomColor(index: number): string {
    let idx = (index) % this.config.RANDOM_COLOR.length
    return this.config.RANDOM_COLOR[idx];
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
    let ret = [];
    if(obj!==null){
      ret = Object.keys(obj).map((k) => obj[k]);
    }
    return ret;
  }

  downloadTimer(timer){
    this.shareService.serviceDownloadTimer(timer)
    .then((res)=>{
      this.events.publish('timer:update-list', timer.category, timer);
      this.loader.dismiss();
    })
  }

  showDownloadConfirm(event: Event, timer) {
    event.stopPropagation();

    let englishDefault = {title:'Download this Timer', message:'Do you agree to download this timer?', btnAgree:'Agree', btnDisagree:'Disagree'}
    let title, message, btnAgree, btnDisagree: string = '';

    this.translate.get('Common.AlertTitle.Information').subscribe((res)=>{title = res});
    this.translate.get('MobileMessage.DownloadTimer').subscribe((res)=>{message= res});
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
            this.downloadTimer(timer);
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
