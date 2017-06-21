import { Pipe,  PipeTransform } from '@angular/core';

@Pipe({
  name: 'fecha'
})
export class FechaPipe implements PipeTransform {

  transform(value: Date): string {
    const meses = new Array ('Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre');
    const diasSemana = new Array('Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado');
    const f: Date = new Date(value);
    const hoy = new Date();

    if (hoy.getDate() === f.getDate() && hoy.getMonth() === f.getMonth() && hoy.getFullYear()===f.getFullYear()){
      return 'hoy a las ' + f.getHours() + ':' + f.getMinutes() + ' horas';
    }
    return diasSemana[f.getDay()] + ',  ' + f.getDate() + ' de ' +
      meses[f.getMonth()] + ' de ' + f.getFullYear() + ' a las ' + f.getHours() + ':' + f.getMinutes() + ' horas';
  }

}
