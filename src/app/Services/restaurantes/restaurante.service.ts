import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Restaurante } from './restaurante';
import { environment } from '../../../enviroments/enviroment';

@Injectable({
  providedIn: 'root'
})
export class RestauranteService {

  constructor(private http: HttpClient) { }

  getTodosRestaurantes(): Observable<Restaurante[]> {
    return this.http.get<Restaurante[]>(environment.urlHost + "/restaurante");
  }

  getRestauranteById(id: number): Observable<Restaurante> {
    return this.http.get<Restaurante>(`${environment.urlHost + "/restaurante"}/${id}`);
  }

  getRestaurantesDeLugar(id: number): Observable<Restaurante[]> {
    return this.http.get<Restaurante[]>(`${environment.urlHost + "/restaurantesDeLugar"}/${id}`);
  }

  guardarRestaurante(restaurante: Restaurante, idUser: number, idLugar: number): Observable<Restaurante> {
    return this.http.post<Restaurante>(`${environment.urlHost + "/restaurante"}/${idUser}/${idLugar}`, restaurante);
  }

  eliminarRestaurante(id: number): Observable<Restaurante> {
    return this.http.delete<Restaurante>(`${environment.urlHost + "/restaurante"}/${id}`);
  }

  // Obtener los Restaurantes por el nombre del usuario, para mostrar en el perfil qué lugares creó esa persona
  getRestaurantesByIdUser(idUser: number): Observable<Restaurante[]> {
    return this.http.get<Restaurante[]>(`${environment.urlHost + "/restaurantesByIdUser"}/${idUser}`);
  }
}