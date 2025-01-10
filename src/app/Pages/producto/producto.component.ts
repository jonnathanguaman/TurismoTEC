import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrl: './producto.component.css'
})
export class ProductoComponent {
  
  modalAbierto:boolean = false

  abrirDescripcion(){
    this.modalAbierto = true
  }

  cerrarDescripcion(){
    this.modalAbierto = false
  }
}
