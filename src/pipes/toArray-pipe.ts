import { Pipe, PipeTransform } from "@angular/core";
// utils
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'toArrayPipe',
  pure: false
})
export class ToArrayPipe implements PipeTransform {
  constructor(public translate: TranslateService){}
  transform(item: any, trans: any): any {
    if(item==''){
      return '';
    }else{
      let _item:any = Object.keys(item).map((k) => item[k]);
      if(_item['order']!==null){
        _item.sort(function(a, b){return a.order - b.order});
      }
      return _item;
    }
  }
}
