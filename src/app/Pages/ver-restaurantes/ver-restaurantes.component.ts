import { Component, Input, OnInit } from '@angular/core';
import { HotelesService } from '../../Services/hoteles/hoteles.service';
import { RestauranteService } from '../../Services/restaurantes/restaurante.service';
import { Restaurante } from '../../Services/restaurantes/restaurante';
import { environment } from '../../../enviroments/enviroment';

@Component({
  selector: 'app-ver-restaurantes',
  templateUrl: './ver-restaurantes.component.html',
  styleUrls: ['./ver-restaurantes.component.css']
})
export class VerRestaurantesComponent implements OnInit{
  
  constructor(private restauranteService:RestauranteService){}

  @Input() idLugar?:number

  todosRestaurantes!:Restaurante[]
  nombreRestauranteBuscado!:string
  urlHost:string = environment.urlAut;
  
  ngOnInit(): void {
    if(this.idLugar){
      this.obtenerRestauranteDeLugar(this.idLugar)
    }else{
      this.obtenerTodosRestaurantes()
    }
  }

  obtenerTodosRestaurantes(){
    this.restauranteService.getTodosRestaurantes().subscribe(restaurate =>{
      this.todosRestaurantes = restaurate
    })
  }

  obtenerRestauranteDeLugar(id:number){
    this.restauranteService.getRestauranteDeLugar(id).subscribe(auxrestauranteDeLugar =>{
      this.todosRestaurantes = auxrestauranteDeLugar
    })
  }

  filtrarRestaurantes() {
    const nombreLower = this.nombreRestauranteBuscado.toLowerCase();
    this.restauranteService.getTodosRestaurantes().subscribe(rest =>{
      this.todosRestaurantes = rest.filter((rest) =>
        rest.nombre.toLowerCase().includes(nombreLower)
      )
    })
  }

  filtrarHotelesRecomendaciones() {
    const nombreLower = this.nombreRestauranteBuscado.toLowerCase();
    this.restauranteService.getRestauranteDeLugar(this.idLugar!).subscribe(rest =>{
      this.todosRestaurantes = rest.filter((rest) =>
        rest.nombre.toLowerCase().includes(nombreLower)
      )
    })
  }
}
