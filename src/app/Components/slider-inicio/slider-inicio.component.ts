import { Component, OnInit, OnDestroy } from '@angular/core';
import { ImagenesInicioService } from '../../Services/ImagenesInicio/imagenes-inicio.service';
import { environment } from '../../../enviroments/enviroment';

@Component({
  selector: 'app-slider-inicio',
  templateUrl: './slider-inicio.component.html',
  styleUrls: ['./slider-inicio.component.css'],
})
export class SliderInicioComponent implements OnInit {
  imagenes: string[] = [];

  constructor(private imagenesService: ImagenesInicioService) {}

  urlHost:string = environment.urlAut;

  ngOnInit(): void {
    this.cargarImagenes();
  }

  cargarImagenes(): void {
    this.imagenesService.getImagenes().subscribe({
      next: (data) => {
        this.imagenes = data.map((img: any) => img.url); // Mapear las URLs
      },
      error: (err) => {
        console.error('Error al cargar imágenes', err);
      },
    });
  }
}