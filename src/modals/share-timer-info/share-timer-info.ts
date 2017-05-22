import { Component } from '@angular/core';
import { NavController, Events, NavParams, ModalController, ViewController, AlertController, LoadingController } from 'ionic-angular';

// services
import { ShareService } from '../../services/share-service';

// pipe
import { ToArrayPipe } from '../../pipes/toArray-pipe';

// utils
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'share-timer-info',
  providers:[ShareService],
  templateUrl: 'share-timer-info.html'
})
export class ShareTimerInfoModal{
  timer: any;
  loader: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public modalCtrl: ModalController,
    public translate: TranslateService,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public shareService: ShareService,
    public events: Events,
  ) {
    this.timer = navParams.get('timer');
  }

  closeModal() {
    this.navCtrl.pop();
  }

  onBackCategory(){
    this.closeModal();
  }

  downloadTimer(){
    this.shareService.serviceDownloadTimer(this.timer)
    .then((res)=>{
      this.events.publish('timer:update-list', this.timer.category, this.timer);
      this.loader.dismiss();
    })
  }

  onDownloadTimer() {
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
            this.downloadTimer();
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
