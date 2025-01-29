import { Component, Input, OnInit } from '@angular/core';
import { ImagenesRestaurantesService } from '../../Services/imagenesRestaurantes/imagenes-restaurantes.service';
import { ImagenesRestaurantes } from '../../Services/imagenesRestaurantes/imagenesRestaurantes';
import { environment } from '../../../enviroments/enviroment';

@Component({
  selector: 'app-slider-restaurante',
  templateUrl: './slider-restaurante.component.html',
  styleUrls: ['./slider-restaurante.component.css']
})
export class SliderRestauranteComponent implements OnInit{

  @Input() idRestaurante?:number

  constructor(private imgRestaurante:ImagenesRestaurantesService){}
  
  imgRestaurantes!:ImagenesRestaurantes[]
  urlHost:string = environment.urlAut;

  ngOnInit(): void {
    if(this.idRestaurante){
      this.obtenerImagenesByIdRestaurante(this.idRestaurante)
    }
  }

  obtenerImagenesByIdRestaurante(idRestaurant:number){
    this.imgRestaurante.getImagenesByIdRestaurantes(idRestaurant).subscribe(imgRest =>{
      this.imgRestaurantes = imgRest
    })
}

}
