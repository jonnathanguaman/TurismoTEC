import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ReviewHoteles } from './review-hoteles';
import { environment } from '../../../enviroments/enviroment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReviewHotelesService {

  constructor(private http: HttpClient) { }
  
    obtenerReviewByIdHotel(idLugar:number): Observable<ReviewHoteles[]> {
      return this.http.get<ReviewHoteles[]>(`${environment.urlHost + "/reviewHotelByIdHotel"}/${idLugar}`);
    }
    
    crearReviewHotel(reviewHoteles:ReviewHoteles,idUsuario:number, idHotel:number): Observable<ReviewHoteles> {
      return this.http.post<ReviewHoteles>(`${environment.urlHost + "/reviewHotel"}/${idUsuario}/${idHotel}`, reviewHoteles)
    }
}
