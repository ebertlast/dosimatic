import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'capitalize'
})
export class CapitalizePipe implements PipeTransform {

  transform(value:any) {
    if (value) {
        let w:string="";
        value.split(" ").forEach(word => {
          w+=word.charAt(0).toUpperCase() + word.slice(1)+" "
        });
        return w;
    }
    return value;
  }

}
