import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: 'categoryPipe'
})
export class CategoryPipe implements PipeTransform {
  transform(items: any, filter: any): any {
    let arr = [];
    for(let key in items){
      if(items[key]['category'] === filter.category){
        arr.push(items[key]);
      }
    }
    return arr.length;
  }
}
