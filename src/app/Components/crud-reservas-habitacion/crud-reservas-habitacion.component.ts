import { Component, OnInit } from '@angular/core';
import { ReservaHatitacion } from '../../Services/registrarReservaHabitacion/reservaHotel';
import { ReservaHotelService } from '../../Services/registrarReservaHabitacion/reserva-hotel.service';

@Component({
  selector: 'app-crud-reservas-habitacion',
  templateUrl: './crud-reservas-habitacion.component.html',
  styleUrl: './crud-reservas-habitacion.component.css'
})
export class CrudReservasHabitacionComponent implements OnInit{

  isCrudModalOpen: boolean = false;
  editar:boolean = false

  todasLasReservaciones:ReservaHatitacion[]

  constructor(private reservaHotelService:ReservaHotelService){}
  ngOnInit(): void {
    this.obtenerReservas()
  }

  openCrudModal() {
    this.isCrudModalOpen = true;
  }

  closeCrudModal() {
    this.isCrudModalOpen = false;
  }

  obtenerReservas(){
    this.reservaHotelService.getReservasHabitaciones().subscribe({
      next:(reservas)=>{
        this.todasLasReservaciones = reservas
      }
    })
  }
  
}
