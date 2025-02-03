import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EtiquetaHotel } from './etiqueta-hotel';
import { environment } from '../../../enviroments/enviroment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EtiquetaHotelService {

  constructor(private http: HttpClient) { }

  crearEtiquetaHotel(etiqueta: EtiquetaHotel): Observable<EtiquetaHotel> {
    return this.http.post<EtiquetaHotel>(environment.urlHost + "/etiquetasHoteles", etiqueta)
  }

  agregarHotelAEtiqueta(etiqueta: EtiquetaHotel, idHotel: number,opcion:number): Observable<EtiquetaHotel> {
    return this.http.post<EtiquetaHotel>(`${environment.urlHost + "/etiquetasHotelesHotel"}/${idHotel}/${opcion}`, etiqueta)
  }

  getEtiquetaHotel(): Observable<EtiquetaHotel[]> {
    return this.http.get<EtiquetaHotel[]>(environment.urlHost + "/etiquetasHoteles");
  }

  obtenerEtiquetaById(id: number): Observable<EtiquetaHotel> {
    return this.http.get<any>(`${environment.urlHost + "/etiquetasHoteles"}/${id}`)
  }

  editarEtiquetaHotel(etiqueta: EtiquetaHotel, idHotel: number): Observable<EtiquetaHotel> {
    return this.http.post<any>(`${environment.urlHost + "/etiquetasHoteles"}/${idHotel}`, etiqueta)
  }

  eliminarEtiquetaHotel(id: number): Observable<EtiquetaHotel> {
    return this.http.delete<EtiquetaHotel>(`${environment.urlHost + "/etiquetasHoteles"}/${id}`)
  }

  getEtiquetaDelHotel(idHotel: number): Observable<EtiquetaHotel[]> {
    return this.http.get<EtiquetaHotel[]>(`${environment.urlHost + "/etiquetasDeHotelFilter"}/${idHotel}`)
  }
}
