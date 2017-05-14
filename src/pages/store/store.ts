import { Component } from '@angular/core';
import { NavController, NavParams, Events } from 'ionic-angular';

@Component({
  selector: 'store-page',
  templateUrl: 'store.html'
})
export class StorePage {

  rootNavCtrl: NavController;
  items:any = [];

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.rootNavCtrl = navParams.get('rootNavCtrl');
  }
  getItems(event:Events){

  }
}
