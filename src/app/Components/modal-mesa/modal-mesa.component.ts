import { Component } from '@angular/core';

@Component({
  selector: 'app-modal-mesa',
  templateUrl: './modal-mesa.component.html',
  styleUrls: ['./modal-mesa.component.css']
})
export class ModalMesaComponent {

  isVisible: boolean = false;

  // Método para mostrar el modal
  abrirModal(): void {
    this.isVisible = true;
  }

  // Método para cerrar el modal
  cerrarModal(): void {
    this.isVisible = false;
  }
}
