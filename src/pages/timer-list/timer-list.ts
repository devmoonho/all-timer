import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { UUID } from 'angular2-uuid';
import { Observable } from 'rxjs/Rx';

// services
import { TimerService } from '../../services/timer-service';

// pipe
import { CategoryPipe } from '../../pipes/category-pipe';

@Component({
  selector: 'page-timer-list',
  providers:[TimerService],
  templateUrl: 'timer-list.html',
})
export class TimerListPage {
  rootNavCtrl: NavController;

  timerList: any;
  category: any;

  randomColor: any = ['#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5',
  '#2196F3', '#03A9F4', '#00BCD4', '#009688', '#4CAF50', '#8BC34A', '#CDDC39',
  '#FFC107', '#FF9800', '#FF5722', '#795548', '#9E9E9E', '#607D8B'];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public timerService: TimerService,
  ){
    this.rootNavCtrl = navParams.get('rootNavCtrl');
  }

  ngOnInit(){
    this.timerService.serviceTimerData()
    .then((res)=>{
        console.log(res);
        this.timerList = res;
    })

    this.timerService.serviceTimerCategoryData()
    .then((res)=>{
        console.log(res);
        this.category= res;
    })
  }

  getRandomColor(index: number): string {
    let idx = (index) % this.randomColor.length
    return this.randomColor[idx];
  }
  
}
