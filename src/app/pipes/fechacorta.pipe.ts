import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fechacorta'
})
export class FechacortaPipe implements PipeTransform {

  transform(value: Date): string {
    let f:any = new Date(value);
    let dd:any = f.getDate();
    let mm:any = f.getMonth()+1; //January is 0!
    let yyyy:any = f.getFullYear();
    let h:any=f.getHours();
    let m:any=f.getMinutes();
    if(dd<10){
        dd='0'+dd;
    }
    if(mm<10){
        mm='0'+mm;
    }
    if(h<10) h='0'+h;
    if(m<10) m='0'+m;

    return dd+'/'+mm+'/'+yyyy+' '+h+':'+m;

  }

}
