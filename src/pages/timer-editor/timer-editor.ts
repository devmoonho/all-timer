import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Content } from 'ionic-angular';
import { trigger, state, style, transition, animate } from '@angular/core'
import { reorderArray } from 'ionic-angular';
import { UUID } from 'angular2-uuid';
import { Observable } from 'rxjs/Rx';
import { ImagePicker } from '@ionic-native/image-picker';

// validator
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// services
import { TimerService } from '../../services/timer-service';
import { Config } from '../../app/config';

// pages

@Component({
  selector: 'page-timer-editor',
  providers: [TimerService],
  templateUrl: 'timer-editor.html',
  animations: [
    trigger('timerAnimationMode', [
    state('shown' , style({opacity: 1 })),
    state('hidden', style({opacity: 0, 'display':'none' })),
    transition('hidden => shown', animate('.5s'))]),

    trigger('removeAnimationMode', [
    state('shown' , style({opacity: 1 })),
    state('hidden', style({opacity: 0, 'display':'none' })),
    transition('hidden => shown', animate('.5s'))]),
  ],
  inputs: ['inputSelectedTimer']
})
export class TimerEditorPage{
  @ViewChild(Content) content: Content;

  timerMainForm: FormGroup;
  timerForm: FormGroup;

  viewMode: string = 'shown';
  inputMode: string = 'hidden';
  colorMode: string = 'hidden';
  removeMode: string = 'hidden';

  selectedColor: string = '#000000';
  selectedImage: string = 'assets/image/timer-default.png';

  timer: any;

  currentTimer: any;

  timerItems: any;

  categoryList: any;

  constructor(
    public imagePicker: ImagePicker,
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public timerService: TimerService,
    public config: Config,
  ){
    this.initValidator()
  }

  initValidator(){
    this.timerMainForm= this.formBuilder.group({
      "timerName":["",Validators.required],
      "category":["",Validators.required],
    })
    this.timerForm= this.formBuilder.group({
      "title":["",Validators.required],
      "settime":["",Validators.required],
      "detail":["",Validators.required],
    })
  }

  ngOnInit(){
    this.timer = this.config.DEFAULT_TIMER[0]
    this.categoryList = this.config.CATETGORY;
    this.currentTimer = this.config.TEMPLATE;

    this.timerItems = this.config.DEFAULT_TIMER[0].timerItems;
    this.utilsSortByOrder(this.timerItems)

    this.setDefaultData(this.timer);
  }

  setDefaultData(timer){
    if(this.navParams.get('mode') === 'create'){
      timer.timerId = UUID.UUID();
      timer.name = 'Please enter';
      timer.summary = 'Please enter';
      timer.timerItems[0].id = UUID.UUID();
      timer.timerItems[0].title = 'Please enter';
      timer.timerItems[0].detail = 'Please enter';
    }
  }

  utilsSortByOrder(timerItems){
    timerItems.sort(function(a, b){return a.order - b.order});
  }

  utilsGetTimerPositionByTimer(timer){
    let cnt: number = 0;
    for(let _timer of this.timerItems){
      if(_timer == timer){
        return cnt;
      }
      cnt +=1;
    }
    return -1;
  }

  getCurrentTimer(){
    return this.timerItems[this.utilsGetTimerPositionByTimer(this.currentTimer)];
  }

  setMode(mode){
    switch (mode){
      case 'view':
        this.inputMode = 'hidden';
        this.colorMode = 'hidden';
        this.viewMode= 'shown';
      break;
      case 'input':
        this.inputMode= 'shown';
        this.colorMode = 'hidden';
        this.viewMode= 'hidden';
      break;
      case 'color':
        this.inputMode = 'hidden';
        this.colorMode = 'shown';
        this.viewMode= 'hidden';
      break;
      default:
        this.inputMode = 'hidden';
        this.colorMode = 'hidden';
        this.viewMode= 'shown';
      break;
    }
  }

  onOpenImagePicker(){
    let options: any = {
      maximumImagesCount: 1,
      width: 400,
      height: 400,
      quality: 100,
      outputType: 0
    };

    this.imagePicker.hasReadPermission()
    .then((res)=>{
      console.log('hasReadPermission:', res);
    })

    this.imagePicker.requestReadPermission()
    .then((res)=>{
      console.log('requestReadPermission:', res);
    })

    this.imagePicker.getPictures(options)
    .then((results) => {
      for (var i = 0; i < results.length; i++) {
        console.log('Image URI: ' + results[i]);
      }
      if(results[0]=='' || results[0]==undefined){
        this.selectedImage = 'assets/image/timer-default.png';
      }else{
        this.selectedImage = results[0]
      }
    }, (err) => {
      this.selectedImage = 'assets/image/timer-default.png';
      console.log('Image err:', err);
    });
  }

  onColorPicker(){
    this.setMode('color');
  }

  onSetColor(event, color){
    event.stopPropagation();

    let _timer: any = this.getCurrentTimer();
    _timer.color= color;
    this.setMode('input');
  }

  onCancelTimeSet(){
    this.setMode('input');
  }

  onChangeTimeSet(){
    let _timer: any = this.getCurrentTimer();
    _timer.timeSet= this.currentTimer.timeSet;
    _timer.defaultTimeSet = this.currentTimer.timeSet;
  }

  goAddTimer(){
    let _timer = Object.assign({}, this.config.TEMPLATE)
    _timer.id = UUID.UUID();
    this.timerItems.push(_timer);
    this.content.scrollTo(0, this.content.getContentDimensions().scrollHeight, 1000);
  }

  goToggleRemove(){
    this.removeMode = (this.removeMode == 'shown') ? 'hidden': 'shown';
  }

  goRemoveTimer(event,timer){
    event.stopPropagation();
    console.log(timer);
    this.timerItems = this.timerItems.filter((jsonObject) => {
        return jsonObject.id != timer.id;
    });
  }

  goTimerEdit(event, timer){
    event.stopPropagation();
    console.log(timer);
    this.currentTimer = timer;
    this.setMode('input');
    this.content.scrollTo(0, 0, 0);
  }

  goSaveTimerItems(title, detail){
    let _timer: any = this.getCurrentTimer();
    _timer.title = title;
    _timer.detail = detail;

    this.setMode('view');
  }

  goCancelTimerItems(title, detail){
    title = detail = '';
    this.setMode('view');
  }

  goReorderItems(evt){
    this.timerItems = reorderArray(this.timerItems, evt);
  }

  onSaveMain(validator){
    console.log('onSaveMain', validator, this.timerMainForm.valid);
  }

  onSaveTimer(validator){
    console.log('onSaveTimer', validator, this.timerForm.valid);
  }

}
