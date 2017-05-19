import { Component } from '@angular/core';
import { NavController, NavParams, Events, ModalController, ViewController, AlertController } from 'ionic-angular';
import { ImagePicker } from '@ionic-native/image-picker';

// validator
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// services
import { Config } from '../../app/config';
import { Globals } from '../../app/globals';

// modals
import { ColorPickerModal } from '../../modals/color-picker/color-picker';

// utils
import { TranslateService } from '@ngx-translate/core';
import { Device } from '@ionic-native/device';
import { NativeAudio } from '@ionic-native/native-audio';

@Component({
  selector: 'timer-editor-detail',
  templateUrl: 'timer-editor-detail.html',
})

export class TimerEditorDetailModal{
  timerForm: FormGroup;

  selectedColor: string = '#000000';
  defaultImage: string = 'assets/image/timer-default.png';

  currentTimer: any;

  defaultSound: string = 'assets/sound/default.mp3';
  soundList:any;
  soundPlayState: string = 'pause';
  isMobile: boolean = true;

  constructor(
    public imagePicker: ImagePicker,
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public config: Config,
    public globals: Globals,
    public translate: TranslateService,
    public events: Events,
    public modalCtrl: ModalController,
    public device: Device,
    public nativeAudio: NativeAudio,
    public alertCtrl: AlertController,
    public viewCtrl: ViewController,
  ){
    this.initValidator()

    if(device.uuid === null){
      this.isMobile = false;
    }
  }

  initValidator(){
    this.timerForm= this.formBuilder.group({
      "title":["",Validators.required],
      "settime":["",Validators.required],
      "detail":["",Validators.required],
    })
  }

  ngOnInit(){
    this.soundList = this.config.SOUND;
    this.initDefaultTimerData();
  }

  initDefaultTimerData(){
    this.currentTimer = this.navParams.get('timer');
  }

  private base64textString:String="";

  fileChangeEvent(fileInput: any){
    console.log(fileInput.target.files[0]);
    var files = fileInput.target.files;
    var file = files[0];

    var reader = new FileReader();
    reader.onload =this._handleReaderLoaded.bind(this);
    reader.readAsBinaryString(file);
  }

  _handleReaderLoaded(readerEvt) {
    var binaryString = readerEvt.target.result;
    this.base64textString= btoa(binaryString);

    this.currentTimer.image = "data:image/png;base64," + btoa(binaryString);
  }

  onChangeTimeSet(){
    this.currentTimer.defaultTimeSet = this.currentTimer.timeSet;
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
      if(data!==undefined){
        this.currentTimer.color = data.color;
      }
    });
    colorPickerModal.present();
  }

  onCancelTimerItems(){
    this.viewCtrl.dismiss({timer:''});
  }

  onSaveTimerItems(title, detail){
    this.currentTimer.title = title;
    this.currentTimer.detail = detail;
    this.nativeAudio.unload(this.currentTimer.id);
    this.viewCtrl.dismiss({timer:this.currentTimer});
  }

  utilsObjectToArray(obj){
    return Object.keys(obj).map((k) => obj[k])
  }

  utilsSortByOrder(timerItems){
    timerItems.sort(function(a, b){return a.order - b.order});
  }

  utilsRandomRange(min, max){
    var RandVal = Math.random() * (max- min) + min;
    return Math.floor(RandVal);
  }
}
