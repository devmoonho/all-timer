import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: 'categoryPipe'
})
export class CategoryPipe implements PipeTransform {
  transform(items: any, filter: any): any {
    let arr = [];
    for(let _item in items){
      if(items[_item]['category'] === filter.category){
        arr.push(items[_item]);
      }
    }
    return arr
  }

  getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
  }
}
