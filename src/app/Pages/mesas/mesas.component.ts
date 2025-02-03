import { Component, OnInit } from '@angular/core';
import { RestauranteService } from '../../Services/restaurantes/restaurante.service';
import { ActivatedRoute } from '@angular/router';
import { Restaurante } from '../../Services/restaurantes/restaurante';
import { MesasService } from '../../Services/mesas/mesas.service';
import { Mesa } from '../../Services/mesas/mesas';

@Component({
  selector: 'app-mesas',
  templateUrl: './mesas.component.html',
  styleUrls: ['./mesas.component.css'],
})
export class MesasComponent implements OnInit {
  constructor(
    private restauranteService: RestauranteService,
    private activedRouter: ActivatedRoute,
    private mesasService:MesasService,
  ) {}

  ngOnInit(): void {
    this.obtenerRestaurante()
  }

  restauranteEncontrado!: Restaurante;
  enviarIdRestaurante!: number;
  mesasRestaurante!:Mesa[]

  obtenerRestaurante() {
    this.activedRouter.params.subscribe((params) => {
      let id = params['id'];
      if (id) {
        this.restauranteService.getRestauranteById(id).subscribe((rest) => {
          this.restauranteEncontrado = rest;
          this.obtenerMesasDeRestaurante(id);
        });
      }
    });
  }

  obtenerMesasDeRestaurante(id:number){
    this.mesasService.getHabitacionDeHotel(id).subscribe(mesa =>{
      this.mesasRestaurante = mesa
    })
  }

  guardarRestauranteId(enviarIdRestaurante: number) {
    this.enviarIdRestaurante = enviarIdRestaurante!;
  }
}
