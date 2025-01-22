import { Component, OnInit, OnDestroy } from '@angular/core';
import { ImagenesInicioService } from '../../Services/ImagenesInicio/imagenes-inicio.service';

@Component({
  selector: 'app-slider-inicio',
  templateUrl: './slider-inicio.component.html',
  styleUrls: ['./slider-inicio.component.css'],
})
export class SliderInicioComponent implements OnInit {
  imagenes: string[] = []; // Almacena las URLs de las imágenes

  constructor(private imagenesService: ImagenesInicioService) {}

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