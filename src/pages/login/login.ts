import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

// services
import { LoginService } from '../../services/loginService';

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

  constructor( public navCtrl: NavController, public translate: TranslateService, public loginService: LoginService) {

  }

  loginUser(email: string, password: string): void{
    // this.loginService.signInWithEmailAndPassword({email, password});
  }

  goSignup() {
    this.loginSwitch = "signup";
  }

  signup(name: string, email: string, password: string) {

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
}
