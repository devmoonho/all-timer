import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController } from 'ionic-angular';

// services
import { LoginService } from '../../services/login-service';

// pages
import { HomePage } from '../home/home';

// utils
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignupPage{
  constructor( public navCtrl: NavController,
    public translate: TranslateService,
    public loginService: LoginService,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController
  ) {}

  signup(name: string, email: string, password: string) {
    let message: string;

    let loading = this.loadingCtrl.create({
    });

    loading.present();

    this.loginService.serviceSignup({email, password, name})
    .then(() =>{
      this.navCtrl.setRoot(HomePage);
      loading.dismiss();
    })
    .catch((err) => {
      console.log(err)
      loading.dismiss();
      this.showAlert({titleCode: "Common.AlertTitle.Notification", messageObj: err});
    });
  }

  showAlert({titleCode, messageObj}) {
    let title, message, btnConfirm: string;

    this.translate.get(titleCode)
    .subscribe((res: string) => {
      title = res;
    })

    if(typeof messageObj == 'string'){
      this.translate.get(messageObj)
      .subscribe((res: string) => {
        message = res;
      })
    }else{
      this.translate.get("FirebaseMessage." + messageObj.code)
      .subscribe((res: string) => {
        message = res.match("FirebaseMessage.")? messageObj.message : res;
      })
    }

    this.translate.get('Common.Confirm')
    .subscribe((res: string) => {
      btnConfirm = res;
    })

    let alert = this.alertCtrl.create({
      title: title,
      subTitle: message,
      buttons: [{
        text: btnConfirm,
        handler: () => {
          console.log('Confirm clicked');
        }
      }]
    });

    alert.present();
  }
}
