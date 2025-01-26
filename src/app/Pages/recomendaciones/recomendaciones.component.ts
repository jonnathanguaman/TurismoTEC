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
import { EtiquetasLugar } from '../../Services/categoriasLugares/categoriaLugar';
import { LugaresCategoriasService } from '../../Services/lugares_Categorias/lugares-categorias.service';
@Component({
  selector: 'app-recomendaciones',
  templateUrl: './recomendaciones.component.html',
  styleUrls: ['./recomendaciones.component.css'],
})
export class RecomendacionesComponent implements OnInit {
  map: ol.Map | undefined;
  markers: Feature[] = [];  // Array para almacenar los marcadores

  constructor(
    private lugares: LugaresService,
    private categoriaService: CategoriaLugarService,
    private lugares_categoriasService: LugaresCategoriasService,
  ) {}

  categorias!: EtiquetasLugar[];
  todosLugars: Lugares[] = [];

  ngOnInit(): void {
    this.obtenerCategorias();
    this.lugares.getTodosLugares().subscribe({
      next: (lugar) => {
        this.todosLugars = lugar;
      },
      complete: () => {
        if (this.todosLugars.length > 0) {
          this.initMap();  // Cargar el mapa inicialmente
        }
      },
      error: (err) => {
        console.error("Error al obtener los lugares:", err);
      },
    });
  }

  private initMap(): void {
    // Primero, destruir el mapa si ya existe
    if (this.map) {
      this.map.setTarget(null);  // Esto desvincula el mapa del DOM
    }

    // Coordenadas de Cuenca
    const coordinates = fromLonLat([-79.0046, -2.9006]); 

    this.clearMarkers();  // Limpiar los marcadores anteriores

    this.todosLugars.forEach((lugar) => {
      this.addMarker(lugar);  // Agregar los nuevos marcadores
    });

    const markerStyle = new Style({
      image: new Icon({
        src: 'https://cdn-icons-png.flaticon.com/512/7369/7369110.png',
        scale: 0.1,
      }),
    });

    this.markers.forEach(marker => marker.setStyle(markerStyle));

    const vectorSource = new VectorSource({
      features: this.markers,
    });

    const vectorLayer = new VectorLayer({
      source: vectorSource,
    });

    const osmLayer = new TileLayer({
      source: new OSM(),
    });

    this.map = new Map({
      target: 'map',  // Vincula el mapa al contenedor
      layers: [osmLayer, vectorLayer],
      view: new OlView({
        center: coordinates,
        zoom: 11,
      }),
    });

    const select = new Select({
      condition: click,
    });

    this.map.addInteraction(select);

    select.on('select', (e) => {
      const selectedFeature = e.selected[0];
      if (selectedFeature) {
        const url = selectedFeature.get('url');
        if (url) {
          window.location.href = url;
        }
      }
    });

    // Crear el elemento del tooltip
  const tooltipElement = document.getElementById('tooltip') as HTMLElement;

  this.map.on('pointermove', (event) => {
    const feature = this.map?.forEachFeatureAtPixel(event.pixel, (feature) => feature);
    
    if (feature) {
      const name = feature.get('name');  // Obtener el nombre del marcador
      tooltipElement.innerHTML = name || 'Sin nombre';  // Mostrar el nombre en el tooltip
      const coordinate = event.coordinate;
      // Convertir las coordenadas del mapa a píxeles del contenedor
      const pixel = this.map.getPixelFromCoordinate(coordinate);
      tooltipElement.style.left = `${pixel[0] + 350}px`;  // Posición horizontal
      tooltipElement.style.top = `${pixel[1] +50}px`; // Ajusta la posición vertical
      tooltipElement.style.display = 'block';  // Mostrar el tooltip
    } else {
      tooltipElement.style.display = 'none';  // Ocultar el tooltip cuando no se está sobre un marcador
    }
  });
  }

  // Función para agregar un marcador
  addMarker(lugar: Lugares): void {
    const marker = new Feature({
      geometry: new Point(fromLonLat([lugar.longitud, lugar.latitud])),
      url: environment.urlMap + lugar.idLugares,
    });
    this.markers.push(marker);
    marker.set('name',lugar.nombre)
  }
  
  // Función para limpiar los marcadores anteriores
  clearMarkers(): void {
    this.markers = [];  // Limpiar los marcadores existentes
  }

  obtenerCategorias() {
    this.categoriaService.getEtiquetaLugar().subscribe(cat => {
      this.categorias = cat;
    });
  }

  obtenerLugaresPorCategoria(idCategoria: number) {
    this.todosLugars = [];
    this.lugares_categoriasService.getLugaresEtiqueta(idCategoria).subscribe(lugarCat => {
      lugarCat.forEach(lugar => {
        this.todosLugars.push(lugar.lugares);
      });

      this.initMap();
    });
  }
}
