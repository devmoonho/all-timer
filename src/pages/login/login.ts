import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController } from 'ionic-angular';

// services
import { LoginService } from '../../services/login-service';

// pages
import { HomePage } from '../home/home';

// utils
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'page-login',
  providers: [LoginService],
  templateUrl: 'login.html'
})

export class LoginPage {
  loginSwitch: any = "login";
  bgImage: string = './assets/icon/login.png';

  constructor( public navCtrl: NavController,
    public translate: TranslateService,
    public loginService: LoginService,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController
  ) {}

  loginUser(email: string, password: string): void{
    this.loginService.serviceLoginUser({email, password})
    .then(() =>{
      this.successLogin({userInfo:{email, password}, messageCode:"SuccessLogin.SuccessLogin"});
    })
    .catch((err) => {
      console.log(err)
      this.showAlert({titleCode: "SignUp.Alert.LoginErrorTitle", messageObj: err});
    })
  }

  signup(name: string, email: string, password: string) {
    this.loginService.serviceSignup({email, password, name})
    .then(() => {
      this.successSignup({userInfo: {name, email, password}, messageCode: "MobileMessage.SuccessCreateUser"});
    })
    .catch((err) => {
      console.log(err)
      this.showAlert({titleCode: "SignUp.Alert.LoginErrorTitle", messageObj: err});
    });
  }

  private successLogin({userInfo, messageCode}): void{
    let message: string;

    this.translate.get(messageCode)
    .subscribe((res: string) => {
      message = res;
    })

    let loading = this.loadingCtrl.create({
      // too short time
      // content: message
    });

    loading.present();

    this.loginService.serviceSuccessLogin()
    .then((res) =>{
      this.navCtrl.setRoot(HomePage);
      loading.dismiss();
    })
    .catch((err) =>{
      loading.dismiss();
      this.showAlert({titleCode: "SignUp.Alert.LoginErrorTitle", messageObj: err});
    })
  }

  private successSignup({userInfo, messageCode}) {
    let message: string;

    this.translate.get(messageCode)
    .subscribe((res: string) => {
      message = res;
    })

    let loading = this.loadingCtrl.create({
      // content: message
    });

    loading.present();

    this.loginService.serviceSuccessCreateUser({email:userInfo.email, password:userInfo.password})
    .then(() => {
      this.navCtrl.setRoot(HomePage);
      loading.dismiss();
    })
    .catch((err) => {
      console.log(err);
      loading.dismiss();
      this.showAlert({titleCode: "SignUp.Alert.CreateUserErrorTitle", messageObj: err});
    })
  }

  goSignup() {
    this.loginSwitch = "signup";
    this.bgImage = "./assets/icon/login.png";
  }

  goResetPassword(){
    this.loginSwitch = "signup";
  }

  goGooglePlusAuth(){

  }

  goFacebookAuth(){

  }

  goTwitterAuth(){

  }

  showAlert({titleCode, messageObj}) {
    let title, message, btnConfirm: string;

    this.translate.get(titleCode)
    .subscribe((res: string) => {
      title = res;
    })

    console.log(messageObj);
    if(typeof message == 'string'){
      message = messageObj;
    }else{
      this.translate.get("FirebaseMessage." + messageObj.code)
      .subscribe((res: string) => {
        message = res.match("FirebaseMessage.")? messageObj.message : res;
      })
    }

    this.translate.get('Share.Confirm')
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
