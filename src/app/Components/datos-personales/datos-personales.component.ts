import { Component } from '@angular/core';

@Component({
  selector: 'app-datos-personales',
  templateUrl: './datos-personales.component.html',
  styleUrl: './datos-personales.component.css'
})
export class DatosPersonalesComponent {
  usuario!:string;
  contrasena!:string;
  nombre!:string;
  apellido!:string;
  idioma!:string;
  pais!:string;
  edad!:number;
}
