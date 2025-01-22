import { Component, Input, OnInit } from '@angular/core';
import { HabitacionesService } from '../../Services/habitaciones/habitaciones.service';
import { Habitaciones } from '../../Services/habitaciones/habitaciones';

@Component({
  selector: 'app-modal-habitacion',
  templateUrl: './modal-habitacion.component.html',
  styleUrl: './modal-habitacion.component.css'
})
export class ModalHabitacionComponent implements OnInit{

  constructor(private habitacionService:HabitacionesService){}

  @Input() idHabitacion?:number

  habitacion!:Habitaciones
  isVisible: boolean = false;

  abrirModal(): void {
    this.isVisible = true;
    if(this.idHabitacion){
      this.habitacionService.getHabitacionById(this.idHabitacion).subscribe(auxhabitacion =>{
        this.habitacion = auxhabitacion
      })
    }
  }

  cerrarModal(): void {
    this.isVisible = false;
  }
  
  ngOnInit(): void {
  }
}
