import { Component } from '@angular/core';

@Component({
  selector: 'app-menu-restaurante',
  templateUrl: './menu-restaurante.component.html',
  styleUrl: './menu-restaurante.component.css'
})
export class MenuRestauranteComponent {

  isVisible:boolean=false

  abrirModal(): void {
    this.isVisible = true;
  }

  cerrarModal(): void {
    this.isVisible = false;
  }
}
