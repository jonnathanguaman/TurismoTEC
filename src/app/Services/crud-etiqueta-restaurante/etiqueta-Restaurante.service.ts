import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EtiquetaRestaurante } from './etiqueta-Restaurante';
import { environment } from '../../../enviroments/enviroment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EtiquetaRestauranteService {

  constructor(private http: HttpClient) { }

  crearEtiquetaRestaurante(etiqueta: EtiquetaRestaurante): Observable<EtiquetaRestaurante> {
    return this.http.post<EtiquetaRestaurante>(environment.urlHost + "/etiquetasRestaurantes", etiqueta);
  }

  agregarRestauranteAEtiqueta(etiqueta: EtiquetaRestaurante, idRestaurante: number, opcion: number): Observable<EtiquetaRestaurante> {
    return this.http.post<EtiquetaRestaurante>(`${environment.urlHost + "/etiquetasRestaurantesRestaurante"}/${idRestaurante}/${opcion}`, etiqueta);
  }

  getEtiquetaRestaurante(): Observable<EtiquetaRestaurante[]> {
    return this.http.get<EtiquetaRestaurante[]>(environment.urlHost + "/etiquetasRestaurantes");
  }

  obtenerEtiquetaById(id: number): Observable<EtiquetaRestaurante> {
    return this.http.get<any>(`${environment.urlHost + "/etiquetasRestaurantes"}/${id}`);
  }

  editarEtiquetaRestaurante(etiqueta: EtiquetaRestaurante, idRestaurante: number): Observable<EtiquetaRestaurante> {
    return this.http.post<any>(`${environment.urlHost + "/etiquetasRestaurantes"}/${idRestaurante}`, etiqueta);
  }

  eliminarEtiquetaRestaurante(id: number): Observable<EtiquetaRestaurante> {
    return this.http.delete<EtiquetaRestaurante>(`${environment.urlHost + "/etiquetasRestaurantes"}/${id}`);
  }

  getEtiquetaDelRestaurante(idRestaurante: number): Observable<EtiquetaRestaurante[]> {
    return this.http.get<EtiquetaRestaurante[]>(`${environment.urlHost + "/etiquetasDeRestauranteFilter"}/${idRestaurante}`);
  }
}
