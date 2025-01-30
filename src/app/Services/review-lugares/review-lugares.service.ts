import { Injectable } from '@angular/core';
import { ReviewLugar } from './reviewLugares';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../enviroments/enviroment';

@Injectable({
  providedIn: 'root'
})
export class ReviewLugaresService {

  constructor(private http: HttpClient) { }
  
    obtenerReviewByIdLugares(idLugar:number): Observable<ReviewLugar[]> {
      return this.http.get<ReviewLugar[]>(`${environment.urlHost + "/reviewPlacesByIdLugar"}/${idLugar}`);
    }
    
    crearReviewLugares(reviewLugares:ReviewLugar,idUsuario:number, idLugar:number): Observable<ReviewLugar> {
      return this.http.post<ReviewLugar>(`${environment.urlHost + "/reviewPlaces"}/${idUsuario}/${idLugar}`, reviewLugares)
    }
}
