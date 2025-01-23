import { Component, OnInit } from '@angular/core';
import * as ol from 'ol';
import { OSM } from 'ol/source'; // Fuente de OpenStreetMap
import { Map } from 'ol';
import { View as OlView } from 'ol';
import { fromLonLat } from 'ol/proj';
import { Feature } from 'ol';
import { Point } from 'ol/geom';
import { Vector as VectorLayer } from 'ol/layer';
import { Vector as VectorSource } from 'ol/source';
import { Tile as TileLayer } from 'ol/layer'; // Corregido: Usar TileLayer en lugar de Tile
import { Icon, Style } from 'ol/style'; // Importación para estilos personalizados de marcadores
import { Select } from 'ol/interaction'; // Importación para estilos personalizados de marcadores
import { click } from 'ol/events/condition'; // Importación correcta de la condición click
import { Lugares } from '../../Services/Lugares/lugares';
import { LugaresService } from '../../Services/Lugares/lugares.service';
import { environment } from '../../../enviroments/enviroment';
import { CategoriaLugarService } from '../../Services/categoriasLugares/categoria-lugar.service';
import { Categoria } from '../../Services/categoriasLugares/categoriaLugar';
@Component({
  selector: 'app-recomendaciones',
  templateUrl: './recomendaciones.component.html',
  styleUrls: ['./recomendaciones.component.css'],
})
export class RecomendacionesComponent implements OnInit {
  map: ol.Map | undefined;

  constructor(
    private lugares: LugaresService,
    private categoriaService:CategoriaLugarService,  
  ) {}
  categorias!:Categoria[]
  todosLugars: Lugares[] = [];

  ngOnInit(): void {
    this.obtenerCategorias()
    this.lugares.getTodosLugares().subscribe({
      next: (lugar) => {
        this.todosLugars = lugar;
      },
      complete: () => {
        if (this.todosLugars.length > 0) {
          this.initMap();
        }
      },
      error: (err) => {
        console.error("Error al obtener los lugares:", err);
      },
    });
  }
  

  private initMap(): void {
    const coordinates = fromLonLat([-79.0046, -2.9006]); // Coordenadas de Cuenca
    const markers: Feature[] = [];
  
    this.todosLugars.forEach((lugar) => {
      markers.push(
        new Feature({
          geometry: new Point(fromLonLat([lugar.longitud, lugar.latitud])),
          url: environment.urlMap+lugar.idLugares,
        })
      );
    });
  
    const markerStyle = new Style({
      image: new Icon({
        src: 'https://cdn-icons-png.flaticon.com/512/7369/7369110.png',
        scale: 0.1,
      }),
    });
  
    markers.forEach(marker => marker.setStyle(markerStyle));
  
    const vectorSource = new VectorSource({
      features: markers,
    });
  
    const vectorLayer = new VectorLayer({
      source: vectorSource,
    });
  
    const osmLayer = new TileLayer({
      source: new OSM(),
    });
  
    this.map = new Map({
      target: 'map',
      layers: [osmLayer, vectorLayer],
      view: new OlView({
        center: coordinates,
        zoom: 13,
      }),
    });
  
    const select = new Select({
      condition: click,
    });
  
    this.map.addInteraction(select);
  
    select.on('select', (e) => {
      const selectedFeature = e.selected[0];  // Obtener el marcador seleccionado
      if (selectedFeature) {
        const url = selectedFeature.get('url');  // Obtener la URL del marcador
        if (url) {
          window.location.href = url;  // Redirigir a la nueva URL y cerrar la ventana actual
        }
      }
    });    
  }
  
  

  obtenerCategorias(){
    this.categoriaService.getTodosLugares().subscribe(cat =>{
      this.categorias = cat
    })
  }
}
