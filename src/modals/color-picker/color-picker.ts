import { Component } from '@angular/core';
import { ModalController, ViewController } from 'ionic-angular';

// services
import { TimerService } from '../../services/timer-service';

@Component({
  selector: 'color-picker-page',
  templateUrl: 'color-picker.html'
})
export class ColorPickerModal{
  constructor(
    public viewCtrl: ViewController,
  ) { }

  onSetColor(event, _color){
    let colorData :any  = { color : _color };
    this.viewCtrl.dismiss(colorData);
  }
}
