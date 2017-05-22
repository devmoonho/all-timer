import { Pipe, PipeTransform } from "@angular/core";
// utils
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'placeholderPipe',
  pure: false
})
export class PlaceholderPipe implements PipeTransform {
  constructor( public translate: TranslateService){}
  transform(item: any, trans: any): any {
    if(item==''){
      return trans.code;
    }else{
      return item;
    }
  }
}
