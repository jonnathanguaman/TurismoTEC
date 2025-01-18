import { Component } from '@angular/core';

@Component({
  selector: 'app-modal-habitacion',
  templateUrl: './modal-habitacion.component.html',
  styleUrl: './modal-habitacion.component.css'
})
export class ModalHabitacionComponent {

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
