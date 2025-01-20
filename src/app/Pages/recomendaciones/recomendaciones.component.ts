import { Component, OnInit } from '@angular/core';
import { LugaresService } from '../../Services/Lugares/lugares.service';
import { Lugares } from '../../Services/Lugares/lugares';
import { Router } from '@angular/router';
import { ImagenesLugares } from '../../Services/ImagenesLugares/imagenesLugares';
import { ImagenesLugaresService } from '../../Services/ImagenesLugares/imagenes-lugares.service';

@Component({
  selector: 'app-recomendaciones',
  templateUrl: './recomendaciones.component.html',
  styleUrl: './recomendaciones.component.css'
})
export class RecomendacionesComponent implements OnInit{

  constructor(private lugares:LugaresService, private imagenesLugares:ImagenesLugaresService){}

    todosLugars!:Lugares[]
    imagesLugares!:ImagenesLugares[]

    ngOnInit(): void {
      this.lugares.getTodosLugares().subscribe(lugares =>{
        this.todosLugars = lugares

        for(var i =0; i <= 10; i++){
          console.log(lugares[i].imagenesLugars[i].url)
          
        }
      })

      this.imagenesLugares.getImgesLugares().subscribe(imgLugares =>{
        this.imagesLugares = imgLugares
      })
    }

  }