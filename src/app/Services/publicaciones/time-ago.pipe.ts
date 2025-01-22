import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeAgo'
})
export class TimeAgoPipe implements PipeTransform {

  transform(fecha: string | Date): string {
    const fechaPublicacion = new Date(fecha);
    const ahora = new Date();
    const diferencia = ahora.getTime() - fechaPublicacion.getTime();

    const segundos = Math.floor(diferencia / 1000);
    const minutos = Math.floor(segundos / 60);
    const horas = Math.floor(minutos / 60);
    const dias = Math.floor(horas / 24);

    if (dias > 0) return `hace ${dias} día(s)`;
    if (horas > 0) return `hace ${horas} hora(s)`;
    if (minutos > 0) return `hace ${minutos} minuto(s)`;
    return `hace ${segundos} segundo(s)`;
  }

}
