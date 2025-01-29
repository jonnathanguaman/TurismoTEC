import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Restaurante } from './restaurante';
import { Observable } from 'rxjs';
import { environment } from '../../../enviroments/enviroment';

@Injectable({
  providedIn: 'root'
})
export class RestauranteService {

  constructor(private http: HttpClient) { }

  getTodosRestaurantes(): Observable<Restaurante[]> {
    return this.http.get<Restaurante[]>(environment.urlHost + "/restaurante");
  }

  getRestaurantesById(id: number): Observable<Restaurante> {
    return this.http.get<Restaurante>(`${environment.urlHost + "/restaurante"}/${id}`)
  }

  getRestauranteDeLugar(id: number): Observable<Restaurante[]> {
    return this.http.get<Restaurante[]>(`${environment.urlHost + "/restauranteDeLugar"}/${id}`)
  }
  guardarLugares(restaurante: Restaurante): Observable<Restaurante> {
    return this.http.post<Restaurante>(environment.urlHost + "/restaurante", restaurante)
  }

  eliminarLugar(id: number): Observable<Restaurante> {
    return this.http.delete<Restaurante>(`${environment.urlHost + "/restaurante"}/${id}`)
  }
}
