import { Component } from '@angular/core';
import { ViewController, NavController } from 'ionic-angular';

@Component({
  selector: 'color-picker-page',
  templateUrl: 'color-picker.html'
})
export class ColorPickerModal{
  constructor(
    public viewCtrl: ViewController,
    public navCtrl: NavController,
  ) { }

  onSetColor(event, _color){
    let colorData :any  = { color : _color };
    this.viewCtrl.dismiss(colorData);
  }

  onCancelTimerItems(){
    // let colorData :any  = { color : '' };
    // this.viewCtrl.dismiss(colorData);
    this.navCtrl.pop();
  }
}
