import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HotelesService } from '../../Services/hoteles/hoteles.service';
import { Hoteles } from '../../Services/hoteles/hoteles';
import { ActivatedRoute } from '@angular/router';
import { HabitacionesService } from '../../Services/habitaciones/habitaciones.service';
import { Habitaciones } from '../../Services/habitaciones/habitaciones';

@Component({
  selector: 'app-habitaciones',
  templateUrl: './habitaciones.component.html',
  styleUrl: './habitaciones.component.css',
})
export class HabitacionesComponent implements OnInit {

  

  constructor(
    private hotelservice: HotelesService,
    private activedRouter: ActivatedRoute,
    private habitacionService: HabitacionesService,
  ) {}

  hotelEncontrado!: Hoteles;
  habitacionesDeHotel!:Habitaciones[]
  enviarIdHabitacion?:number;

  ngOnInit(): void {
    this.obtenerHoteles()
  }


  obtenerHoteles(){
    this.activedRouter.params.subscribe((params) => {
      let id = params['id'];
      if (id) {
        this.hotelservice.getHotelById(id).subscribe(hotel =>{
          this.hotelEncontrado = hotel
          this.obtenerHabitacionesDeHotel(id)
        })
      }
    });
  }

  obtenerHabitacionesDeHotel(id:number){
    this.habitacionService.getHabitacionDeHotel(id).subscribe(habitaciones =>{
      this.habitacionesDeHotel = habitaciones
    })
  }

  guardarId(idHabitacion:number){
      this.enviarIdHabitacion = idHabitacion!
  }
}
