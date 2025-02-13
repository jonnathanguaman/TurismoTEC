import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-encuesta',
  templateUrl: './encuesta.component.html',
  styleUrl: './encuesta.component.css'
})
export class EncuestaComponent  implements OnInit{

  ngOnInit(): void {

  }
  title = 'turismoCuenca';
  viaje!:string;
  duracion!:string;
  actividad_fisica!:string;
  actividadesSeleccionadas:string[]=[]

  guardarActividades(event: any) {
    const value = event.target.value;
    if (event.target.checked) {
      this.actividadesSeleccionadas.push(value);
    } else {
      const index = this.actividadesSeleccionadas.indexOf(value);
      if (index > -1) {
        this.actividadesSeleccionadas.splice(index, 1);
      }
    }
  } 

  mensajeRecomendarLugareEnviarApi():string{
   const mensaje:string = "hola, estoy viajando con mi"+ this.viaje +", tenemos destinados "+ this.duracion +" dias de vacaciones, me gusta la: "+ this.actividadesSeleccionadas +"; me gusta un nivel de actividad fisica "+ this.actividad_fisica+". Con esta información y solo con palabras sueltas que tipo de lugares me recomiendas visitar. Ejemplo: Cascadas, reservas, naturales, Mercados locales, senderismo ,Caminatas, miradores. Separa cada actividad con una coma."
    return mensaje
  }

  repuesta:string=" caminatas, miradores, baños termales, rafting, canopy, rutas de aventura, parques nacionales, gastronomía local, rutas culturales, museos, ruinas incas, trekking, caminos ancestrales, observación de fauna."

  convertirRespuestaApiArray(respuesta:string){
    var arrayRespuesta:string[] = arrayRespuesta = respuesta.split(",")
    console.log(arrayRespuesta);
  }

}
