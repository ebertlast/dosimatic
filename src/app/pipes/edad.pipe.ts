import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'edad'
})
export class EdadPipe implements PipeTransform {

  transform(fecha: Date): any {
    let f:Date=new Date(+fecha.toString().split("-")[0],+fecha.toString().split("-")[1],+fecha.toString().substr(0,10).split("-")[2],0,0,0,0);
    if(this.isValidDate(f.getDay()+"/"+f.getMonth()+"/"+f.getFullYear())==true)
    {
        let fecha:any=f;
        let hoy:any = new Date();
        let edad:number=0;
        let calculo=hoy-fecha;
        calculo=calculo/365/24/60/60/1000;
        edad = parseInt(calculo.toString());
        return edad;
    }else{
        return 0;
    }
  }

  private isValidDate(s:string):boolean
  {
      // console.log(s);
      var separators = ['\\.', '\\-', '\\/'];
      let bits = s.split(new RegExp(separators.join('|'), 'g'));
      let yyyy:any=bits[2];
      let mm:any=bits[1];
      let dd:any=bits[0];
      let d = new Date(yyyy, mm - 1, dd);
      return d.getFullYear() == yyyy && d.getMonth() + 1 == mm;
  }
}
