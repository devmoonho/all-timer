import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Events, ModalController, ViewController, AlertController } from 'ionic-angular';
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
import { StorageService } from '../../services/storage-service';
import { Config } from '../../app/config';
import { Globals } from '../../app/globals';

// pages
import { TimerListPage } from '../timer-list/timer-list';

// modals
import { ColorPickerModal } from '../../modals/color-picker/color-picker';

// utils
import { TranslateService } from '@ngx-translate/core';
import { Device } from '@ionic-native/device';
import { NativeAudio } from '@ionic-native/native-audio';

// pipe
import { ToArrayPipe } from '../../pipes/toArray-pipe';

@Component({
  selector: 'page-timer-editor',
  providers: [TimerService, StorageService],
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
  defaultImage: string = 'assets/image/timer-default.png';

  timer: any;
  timerItems: any =[];

  currentTimer: any;

  categoryList: any;

  soundList:any;
  defaultSound: string = 'assets/sound/default.mp3';
  soundPlayState: string = 'pause';

  constructor(
    public imagePicker: ImagePicker,
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public timerService: TimerService,
    public storageService: StorageService,
    public config: Config,
    public globals: Globals,
    public translate: TranslateService,
    public events: Events,
    public modalCtrl: ModalController,
    public device: Device,
    public nativeAudio: NativeAudio,
    public alertCtrl: AlertController,
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
    this.soundList = this.config.SOUND;
    this.initDefaultTimerData();
  }

  initDefaultTimerData(){
    this.editMode = this.navParams.get('mode')==='edit'?true:false;

    if(this.navParams.get('mode') === 'edit'){
      this.timer = this.navParams.get('timer');
      this.currentTimer = this.config.TEMP_TIMER_ITEMS;
     }else{
      this.timer = this.createTimer();
      this.currentTimer = this.config.TEMP_TIMER_ITEMS;
      this.timer.category = this.navParams.get('category').value;
    }
  }

  createTimer():any{
    let retTimer:any = {}
    let timerKey = UUID.UUID();
    let itemKey = UUID.UUID();

    retTimer = Object.assign({}, this.config.TEMP_TIMER);
    retTimer.timerId = timerKey;

    retTimer.timerItems = {};
    retTimer.timerItems[itemKey] = Object.assign({}, this.config.TEMP_TIMER_ITEMS);

    let englishDefault:any ={ title:"Timer", detail:"..." }
    let item = retTimer.timerItems[itemKey];
    item.id = itemKey;
    this.translate.get('Default.Timer.Title')
    .subscribe((res: string) => {
      if(res === 'Default.Timer.Title'){ item.title = englishDefault.title; }
      else{ item.title= res;}
    })

    item.order = Object.keys(retTimer.timerItems).length;
    item.color = this.config.RANDOM_COLOR[this.utilsRandomRange(0, this.config.RANDOM_COLOR.length-1)];

    return retTimer;
  }

  // edit items
  onSaveTimerItems(title, detail){
    let _timer:any = this.getCurrentTimer();
    _timer.title = title;
    _timer.detail = detail;
    this.nativeAudio.unload(_timer.id);
    this.setMode('timerEdit');
  }

  // edit timer
  onSaveTimerMain(_name, _summary){
    this.timer.name = _name;
    this.timer.summary = _summary;
    // this.events.publish('timer:stop');

    let items:any = this.timer.timerItems;
    for(let key in items){
      items[key].timer = '';
      items[key].subscribtion = '';
      items[key].max = 1;
      items[key].current = 0;
      items[key].status = 'ready';
      items[key].btnStatus= 'start';
      items[key].nextTimer = false;
    }

    console.log(this.timer);

    this.storageService.serviceSetTimer(this.timer.timerId, this.timer)
    .then(()=>{
      this.events.publish('timer:update-list', this.timer.category);
      this.navCtrl.pop();
    })
  }

  onRemoveTimer(event,timer){
    event.stopPropagation();
    delete this.timer.timerItems[timer.id];
    this.onOrderItems();
  }

  onAddTimer(){
    let itemKey:any = UUID.UUID();
    this.timer.timerItems[itemKey] = this.getDefaultTimerItemsData(itemKey);
    this.onOrderItems();
    this.content.scrollTo(0, this.content.getContentDimensions().scrollHeight, 1000);
  }

  onEditTimer(event, _timer){
    event.stopPropagation();
    this.setCurrentTimer(_timer);
    this.soundPlayState = 'pause';
    this.setMode('timerItemsEdit');
    this.content.scrollTo(0, 0, 0);
  }

  onReorderItems(evt){
    this.timer.timerItems = this.utilsArrayToObject(reorderArray(this.utilsObjectToArray(this.timer.timerItems), evt));
  }

  onOrderItems(): any{
    this.utilsArrayToObject(this.utilsObjectToArray(this.timer.timerItems));
  }

  onToggleRemove(){
    this.removeMode = (this.removeMode == 'shown') ? 'hidden': 'shown';
  }

  // common
  setCurrentTimer(_timer){
    for(let key in this.timer.timerItems){
      if(this.timer.timerItems[key] === _timer){
        this.currentTimer = this.timer.timerItems[key];
        break;
      }
    }
  }

  getCurrentTimer():any{
    return this.currentTimer;
  }

  utilsArrayToObject(arr){
    let _obj:any = {};
    let cnt: number = 0;

    for(let item of arr){
      item.order = cnt++;
      _obj[item.id] = item;
    }
    return _obj;
  }

  getDefaultTimerItemsData(itemKey){
    let items = Object.assign({}, this.config.TEMP_TIMER_ITEMS);
    let englishDefault:any ={ title:"Timer", detail:"..." }

    this.translate.get('Default.Timer.Title')
    .subscribe((res: string) => {
      if(res === 'Default.Timer.Title'){ items.title= englishDefault.title; }
      else{ items.title= res;}
    })
    items.id = itemKey;
    items.order = Object.keys(this.timer.timerItems).length;
    items.color = this.config.RANDOM_COLOR[this.utilsRandomRange(0, this.config.RANDOM_COLOR.length-1)];
    return items;
  }

  ///////////////////////////////

  // getCurrentTimer(){
  //   return this.timerItems[this.utilsGetTimerPositionByTimer(this.currentTimer)];
  // }

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

  onSound(state){
    this.soundPlayState = state;
    console.log('onSound', state);

    if(this.device.uuid == null){return;}
    if(state == 'play'){
      this.nativeAudio.preloadSimple(this.currentTimer.id, this.currentTimer.notification.sound)
      .then(()=>{
        this.nativeAudio.play(this.currentTimer.id, () =>{
          this.soundPlayState = 'pause';
        });
      });
    }else{
      this.nativeAudio.unload(this.currentTimer.id);
    }
  }

  onOpenImagePicker(){
    let options: any = {
      maximumImagesCount: 1,
      width: 400,
      height: 400,
      quality: 100,
      outputType: 1
    };

    if(this.device.uuid == null){return;}

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
        this.currentTimer.image = '';
      }else{
        this.currentTimer.image = "data:image/png;base64," + results[0];
      }
    }, (err) => {
      this.currentTimer.image= '';
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

  onSaveMain(validator, name, summary){
    console.log('onSaveMain', validator, this.timerMainForm.valid);
  }

  saveTimerDataToServer({name, summary}){
    this.setTimerData({name, summary});

    if(this.editMode === true){
      this.timerService.serviceUpdateTimer(this.timer)
      .then((res)=>{
        this.events.publish('timer:update-list', this.timer.category);
        this.navCtrl.pop();
      });
    }else{
      this.timerService.serviceAddTimer(this.timer)
      .then((res)=>{
        this.events.publish('timer:update-list', this.timer.category );
        this.navCtrl.pop();
      });
    }
  }

  setTimerData({name, summary}){
    this.timer.name = name;
    this.timer.summary = summary;
    let cnt: number = 0;

    for(let _timer of this.timerItems){
      _timer.order = cnt;
      _timer.timer = '';
      _timer.subscribtion = '';
      _timer.max = 1;
      _timer.current = 0;
      _timer.status = 'ready';
      _timer.btnStatus= 'start';
      _timer.nextTimer = false;
      cnt +=1;
    }
    this.timer.timerItems = this.utilsArrayToObject(this.timerItems);
  }

  onCancelTimerItems(title, detail){
    title = detail = '';
    this.setMode('timerEdit');
  }

  onRemoveMain(){
    this.storageService.serviceDeleteLocalStorage(this.timer.timerId)
    .then(()=>{
      this.events.publish('timer:remove-list', this.timer.category);
      this.navCtrl.popToRoot();
    });
  }

  onCancelMain(){
    this.navCtrl.pop();
  }

  onSaveTimer(validator){
    console.log('onSaveTimer', validator, this.timerForm.valid);
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
  utilsRandomRange(min, max){
    var RandVal = Math.random() * (max- min) + min;
    return Math.floor(RandVal);
  }

  showDeleteConfirm() {
    let englishDefault = {title:'Remove this Timer', message:'Do you agree to remove this timer?', btnAgree:'Agree', btnDisagree:'Disagree'}
    let title, message, btnAgree, btnDisagree: string = '';

    this.translate.get('Common.AlertTitle.Warning').subscribe((res)=>{title = res});
    this.translate.get('MobileMessage.RemoveTimer').subscribe((res)=>{message= res});
    this.translate.get('Common.Agree').subscribe((res)=>{btnAgree= res});
    this.translate.get('Common.Disagree').subscribe((res)=>{btnDisagree= res});

    let confirm = this.alertCtrl.create({
      title: title==''?englishDefault.title:title,
      message: message==''?englishDefault.message:message,
      buttons: [
        {
          text: btnDisagree==''?englishDefault.btnDisagree:btnDisagree,
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: btnAgree==''?englishDefault.btnAgree:btnAgree,
          handler: () => {
          this.onRemoveMain()
          }
        }
      ]
    });
    confirm.present();
  }
}
