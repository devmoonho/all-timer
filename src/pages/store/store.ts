import { Component } from '@angular/core';
import { NavController, NavParams, Events } from 'ionic-angular';

// services
import { ShareService } from '../../services/share-service';
import { StorageService } from '../../services/storage-service';
import { TimerService } from '../../services/timer-service';

// utils
import { UUID } from 'angular2-uuid';

@Component({
  selector: 'store-page',
  providers:[TimerService, ShareService],
  templateUrl: 'store.html'
})
export class StorePage {

  rootNavCtrl: NavController;
  items:any = [];
  searchQuery: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public shareService: ShareService,
    public timerService: TimerService,
  ) {
    this.rootNavCtrl = navParams.get('rootNavCtrl');
  }

  ngOnInit(){
    this.timerService.serviceShareTimerData()
    .then((res)=>{
      this.items = this.utilsObjectToArray(res);
    })
  }

  getItems(event:Events){

  }

  search(){
    this.timerService.serviceQueryShareTimerData(this.searchQuery)
    .then((res)=>{
      this.items = this.utilsObjectToArray(res);
    })
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
}
