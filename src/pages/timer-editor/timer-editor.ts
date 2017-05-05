import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Events, ModalController, ViewController } from 'ionic-angular';
import { Content } from 'ionic-angular';
import { reorderArray } from 'ionic-angular';
import { UUID } from 'angular2-uuid';
import { ImagePicker } from '@ionic-native/image-picker';

// animation
import { trigger, state, style, transition, animate } from '@angular/core'

// validator
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// services
import { TimerService } from '../../services/timer-service';
import { Config } from '../../app/config';

// pages

// modals
import { ColorPickerModal } from '../../modals/color-picker/color-picker';

// utils
import { TranslateService } from '@ngx-translate/core';

// pipe

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

  editMode: boolean = false;

  timerEditMode: string = 'shown';
  timerItemsEditMode: string = 'hidden';
  removeMode: string = 'hidden';

  selectedColor: string = '#000000';
  selectedImage: string = 'assets/image/timer-default.png';

  timer: any;
  timerItems: any =[];

  currentTimer: any;

  categoryList: any;

  constructor(
    public imagePicker: ImagePicker,
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public timerService: TimerService,
    public config: Config,
    public translate: TranslateService,
    public events: Events,
    public modalCtrl: ModalController,
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
    this.categoryList = this.config.CATETGORY;
    this.setDefaultTimerData();
  }

  setDefaultTimerData(){
    if(this.navParams.get('mode') === 'edit'){
      this.timer = this.navParams.get('timer');
      this.timerItems = this.utilsObjectToArray(this.timer.timerItems);
      this.utilsSortByOrder(this.timerItems)
      this.currentTimer = this.timerItems[0];
     }else{
      this.timer = Object.assign({}, this.config.TEMP_TIMER)
      this.timer.category = this.navParams.get('category').value;
      this.timerItems.push(Object.assign({}, this.config.TEMP_TIMER_ITEMS));
      this.currentTimer = this.timerItems[0];
    }
  }

  getCurrentTimer(){
    return this.timerItems[this.utilsGetTimerPositionByTimer(this.currentTimer)];
  }

  setMode(mode){
    switch (mode){
      case 'timerEdit':
        this.timerItemsEditMode = 'hidden';
        this.timerEditMode= 'shown';
      break;
      case 'timerItemsEdit':
        this.timerItemsEditMode= 'shown';
        this.timerEditMode= 'hidden';
      break;
      case 'color':
        this.timerItemsEditMode = 'hidden';
        this.timerEditMode= 'hidden';
      break;
      default:
        this.timerItemsEditMode = 'hidden';
        this.timerEditMode= 'shown';
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
    let colorPickerModal = this.modalCtrl.create(ColorPickerModal);
    colorPickerModal.onDidDismiss(data => {
      this.getCurrentTimer().color = data.color;
      console.log(data);
    });
    colorPickerModal.present();
  }

  onSetColor(event, color){
    event.stopPropagation();

    let _timer: any = this.getCurrentTimer();
    _timer.color= color;
    this.setMode('timerItemsEdit');
  }

  onCancelTimeSet(){
    this.setMode('timerItemsEdit');
  }

  onChangeTimeSet(){
    let _timer: any = this.getCurrentTimer();
    _timer.timeSet= this.currentTimer.timeSet;
    _timer.defaultTimeSet = this.currentTimer.timeSet;
  }

  goAddTimer(){
    let _timerItem = Object.assign({}, this.config.TEMP_TIMER_ITEMS);
    _timerItem.id = UUID.UUID();
    this.timerItems.push(_timerItem);
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
    this.setMode('timerItemsEdit');
    this.content.scrollTo(0, 0, 0);
  }

  onSaveTimerMain(name, summary){
    this.saveTimerDataToServer({name, summary});
  }

  onSaveMain(validator, name, summary){
    console.log('onSaveMain', validator, this.timerMainForm.valid);
  }

  saveTimerDataToServer({name, summary}){
    this.setTimerData({name, summary});

    if(this.editMode === false){
      this.timerService.serviceAddTimer(this.timer)
      .then((res)=>{
        this.events.publish('timer:update-list', this.timer.category );
        this.navCtrl.pop();
      });
    }else{
      this.timerService.serviceUpdateTimer(this.timer)
      .then((res)=>{
        this.events.publish('timer:update-list', this.timer.category);
        this.navCtrl.pop();
      }); }
  }

  setTimerData({name, summary}){
    this.timer.name = name;
    this.timer.summary = summary;
    let cnt: number = 0;
    for(let _timer of this.timerItems){
      _timer.order = cnt;
      _timer.timer = '';
      cnt +=1;
    }
    this.timer.timerItems = this.utilsArrayToObject(this.timerItems);
  }

  goSaveTimerItems(title, detail){
    let _timer: any = this.getCurrentTimer();
    _timer.title = title;
    _timer.detail = detail;

    this.setMode('timerEdit');
  }

  goCancelTimerItems(title, detail){
    title = detail = '';
    this.setMode('timerEdit');
  }

  goReorderItems(evt){
    this.timerItems = reorderArray(this.timerItems, evt);
  }

  onRemoveMain(){
    this.timerService.serviceRemoveTimer(this.timer)
    .then((res)=>{
      this.events.publish('timer:update-list', this.timer.category);
      this.navCtrl.pop();
    });
  }

  onCancelMain(){
    this.navCtrl.pop();
  }

  onSaveTimer(validator){
    console.log('onSaveTimer', validator, this.timerForm.valid);
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
    return Object.keys(obj).map((k) => obj[k])
  }

  utilsSortByOrder(timerItems){
    timerItems.sort(function(a, b){return a.order - b.order});
  }

  utilsGetTimerPositionByTimer(timer){
    let cnt: number = 0;
    for(let _timer of this.timerItems){
      if(_timer.id === timer.id){
        return cnt;
      }
      cnt +=1;
    }
    return -1;
  }
}
