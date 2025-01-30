import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ReviewRestaurante } from './reviewRestaurante';
import { Observable } from 'rxjs';
import { environment } from '../../../enviroments/enviroment';

@Injectable({
  providedIn: 'root'
})
export class ReviewRestauranteService {

  constructor(private http: HttpClient) { }
    
      obtenerReviewByIdRestaurante(idLugar:number): Observable<ReviewRestaurante[]> {
        return this.http.get<ReviewRestaurante[]>(`${environment.urlHost + "/reviewRestauranteByIdRestaurante"}/${idLugar}`);
      }
      
      crearReviewRestaurante(reviewLugares:ReviewRestaurante,idUsuario:number, idRestaurante:number): Observable<ReviewRestaurante> {
        return this.http.post<ReviewRestaurante>(`${environment.urlHost + "/reviewRestaurante"}/${idUsuario}/${idRestaurante}`, reviewLugares)
      }
}
