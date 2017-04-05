import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';

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

  constructor( public navCtrl: NavController,
     public translate: TranslateService,
     public loginService: LoginService,
     public alertCtrl: AlertController
   ) {

  }

  loginUser(email: string, password: string): void{
    // this.loginService.signInWithEmailAndPassword({email, password});
  }

  goSignup() {
    this.loginSwitch = "signup";
  }

  signup(name: string, email: string, password: string) {
    this.loginService.serviceSignup({name, email, password})
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
      let message: any;
      let title: any;

      this.translate.get('Error.' + err.code)
      .subscribe((res: string) => {
        message = res.match("Error.")? err.message : res;
      })

      this.translate.get('SignUp.Alert.LoginErrorTitle')
      .subscribe((res: string) => {
        title = res;
      })
      this.showAlert({title, message});
    });
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

  showAlert({title, message}) {
    let btnConfirm: string;

    this.translate.get('Share.Confirm')
    .subscribe((res: string) => {
      btnConfirm = res;
    })

    let alert = this.alertCtrl.create({
      title: title,
      subTitle: message,
      buttons: [btnConfirm]
    });
    
    alert.present();
  }
}
