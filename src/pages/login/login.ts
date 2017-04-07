import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController } from 'ionic-angular';
import { Globals } from '../../app/globals';

// services
import { LoginService } from '../../services/login-service';

// pages
import { HomePage } from '../home/home';
import { SignupPage } from '../signup/signup';

// utils
import { TranslateService } from '@ngx-translate/core';
import { GooglePlus } from '@ionic-native/google-plus';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { TwitterConnect } from '@ionic-native/twitter-connect';

@Component({
  selector: 'page-login',
  providers: [LoginService],
  templateUrl: 'login.html'
})

export class LoginPage {
  constructor( public navCtrl: NavController,
    public translate: TranslateService,
    public loginService: LoginService,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public globals: Globals
  ) {}

  loginEmail(email: string, password: string): void{
    let loading = this.loadingCtrl.create({
    });

    loading.present();

    this.loginService.serviceLoginEmail({email, password})
    .then(() =>{
      this.navCtrl.setRoot(HomePage);
      loading.dismiss();
    })
    .catch((err) => {
      console.log(err)
      loading.dismiss();
      this.showAlert({titleCode: "Common.AlertTitle.Error", messageObj: err});
    })
  }

  goResetPassword(): void{
    let titleCode: string = "Login.Alert.ResetPasswordTitle";
    let messageCode: string = "Login.Alert.ResetPasswordMessage";
    let inputEmailCode: string = "Login.Alert.InputEmail";
    let btnCancelCode: string = "Login.Alert.BtnCancel";
    let btnOkCode: string = "Login.Alert.BtnOk";

    let title, message, inputEmail, btnCancel, btnOk: string;

    this.translate.get(titleCode)
    .subscribe((res: string) => {
      title = res;
    })

    this.translate.get(messageCode)
    .subscribe((res: string) => {
      message = res;
    })

    this.translate.get(inputEmailCode)
    .subscribe((res: string) => {
      inputEmail = res;
    })

    this.translate.get(btnCancelCode)
    .subscribe((res: string) => {
      btnCancel = res;
    })

    this.translate.get(btnOkCode)
    .subscribe((res: string) => {
      btnOk = res;
    })

    let prompt = this.alertCtrl.create({
      title: title,
      message: message,
      inputs: [
        {
          name: 'email',
          placeholder: inputEmail
        },
      ],
      buttons: [
        {
          text: btnCancel,
          handler: data => {
          }
        },
        {
          text: btnOk,
          handler: data => {
            this.loginService.serviceResetPassword({email: data.email})
            .then((res)=>{
              console.log(res);
              this.showAlert({titleCode: "Login.Alert.SendEmailTitle", messageObj: "Login.Alert.SendEmailMessage"});
            })
            .catch((err)=>{
              console.log(err);
              this.showAlert({titleCode: "Login.Alert.ResetPasswordErrorTitle", messageObj: err});
            })
          }
        }
      ]
    });
    prompt.present();
  }

  goSignup() {
    this.navCtrl.push(SignupPage)
  }

  goGooglePlusLogin(){
    GooglePlus.prototype.login({
      'webClientId': this.globals.WEB_CLINED_ID
    })
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.error(err)
    });
  }

  goFacebookLogin(){
    Facebook.prototype.login(
      ["public_profile", "email"]
    )
    .then((res: FacebookLoginResponse)=>{
      console.log(res);
    })
    .catch((err)=>{
      console.error(err)
    })
  }

  goTwitterLogin(){
    TwitterConnect.prototype.login()
    .then((res)=>{
      console.log(res);
    })
    .catch((err)=>{
      console.error(err);
    })
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
          // console.log('Confirm clicked');
        }
      }]
    });

    alert.present();
  }
}
