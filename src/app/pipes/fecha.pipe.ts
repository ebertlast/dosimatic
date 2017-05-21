import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fecha'
})
export class FechaPipe implements PipeTransform {

  transform(value: Date): string {
    let meses = new Array ("Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre");
    let diasSemana = new Array("Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado");
    let f:Date=new Date(value);
    let hoy=new Date();
    if(hoy.getDay() === f.getDay() && hoy.getMonth() === f.getMonth() && hoy.getFullYear()===f.getFullYear())
        return "hoy a las "+f.getHours()+":"+f.getMinutes()+" horas";
    return "el "+diasSemana[f.getDay()] + ", " + f.getDate() + " de " + meses[f.getMonth()] + " de " + f.getFullYear()+" a las "+f.getHours()+":"+f.getMinutes()+" horas";
  }

}
