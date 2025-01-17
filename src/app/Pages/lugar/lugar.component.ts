import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-lugar',
  templateUrl: './lugar.component.html',
  styleUrl: './lugar.component.css'
})
export class LugarComponent {

  modalAbiertoMapa:boolean = false

  modalAbiertoHotel:boolean = false

  modalAbiertoRestaurante:boolean = false

  abrirMapa(){
    this.modalAbiertoMapa = true
  }

  cerrarMapa(){
    this.modalAbiertoMapa = false
  }

  abrirHoteles(){
    this.modalAbiertoHotel = true
  }

  cerrarHoteles(){
    this.modalAbiertoHotel = false
  }

  abrirRestaurantes(){
    this.modalAbiertoRestaurante= true
  }

  cerrarRestaurantes(){
    this.modalAbiertoRestaurante = false
  }

  location: SafeResourceUrl;

  constructor(private sanitizer: DomSanitizer) {
    const url = "https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3787.9762597079143!2d-79.28743602503035!3d-2.7693888972076914!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMsKwNDYnMDkuOCJTIDc5wrAxNycwNS41Ilc!5e1!3m2!1ses!2sec!4v1737124279934!5m2!1ses!2sec";
    this.location = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
  
}
