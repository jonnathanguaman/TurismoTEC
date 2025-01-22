import { Component, OnInit } from '@angular/core';
import { LugaresService } from '../../Services/Lugares/lugares.service';
import { Lugares } from '../../Services/Lugares/lugares';
import { Router } from '@angular/router';
import { ImagenesLugares } from '../../Services/ImagenesLugares/imagenesLugares';
import { ImagenesLugaresService } from '../../Services/ImagenesLugares/imagenes-lugares.service';
import { environment } from '../../../enviroments/enviroment';

@Component({
  selector: 'app-recomendaciones',
  templateUrl: './recomendaciones.component.html',
  styleUrl: './recomendaciones.component.css'
})
export class RecomendacionesComponent implements OnInit{

  constructor(private lugares:LugaresService, private imagenesLugares:ImagenesLugaresService){}

    todosLugars:Lugares[] = []
    urlHost:string = environment.urlAut;
    imagenesLugaresById:ImagenesLugares[]=[]

    ngOnInit(): void {
      // Obtiene todos los lugares
      this.lugares.getTodosLugares().subscribe(lugares => {
        this.todosLugars = lugares || [];
    
        // Itera sobre cada lugar y obtiene sus imágenes
        this.todosLugars.forEach(lugar => {
          this.obtenerImagesByIdLugar(lugar.idLugares).then(imagenes => {
            lugar.imagenesLugars = imagenes; // Asigna las imágenes al lugar correspondiente
          });
        });
      });
    }
    
    obtenerImagesByIdLugar(idLugar: number): Promise<ImagenesLugares[]> {
      return new Promise((resolve, reject) => {
        this.imagenesLugares.getImagenesByIdLugares(idLugar).subscribe(
          imgLugares => resolve(imgLugares),
          error => reject(error)
        );
      });
    }
    

  }