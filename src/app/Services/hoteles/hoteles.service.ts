import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Hoteles } from './hoteles';
import { environment } from '../../../enviroments/enviroment';

@Injectable({
  providedIn: 'root'
})
export class HotelesService {

  constructor(private http: HttpClient) { }

  getTodosHoteles(): Observable<Hoteles[]> {
    return this.http.get<Hoteles[]>(environment.urlHost + "/hotel")
  }

  getHotelById(id: number): Observable<Hoteles> {
    return this.http.get<Hoteles>(`${environment.urlHost + "/hotel"}/${id}`)
  }

  gethotelesDeLugar(id: number): Observable<Hoteles[]> {
    return this.http.get<Hoteles[]>(`${environment.urlHost + "/hotelesDeLugar"}/${id}`)
  }

  guardarHotel(hotel: Hoteles, idUser: number, idLugar: number): Observable<Hoteles> {
    return this.http.post<Hoteles>(`${environment.urlHost + "/hoteles"}/${idUser}/${idLugar}`, hotel)
  }

  eliminarHotel(id: number): Observable<Hoteles> {
    return this.http.delete<Hoteles>(`${environment.urlHost + "/hotel"}/${id}`)
  }

  //Obtener los Hoteles por el nombre del usuario, para mostrar en el perfil que lugares creo esa persona 
  getHotelesByIdUser(idUser: number): Observable<Hoteles[]> {
    return this.http.get<Hoteles[]>(`${environment.urlHost + "/hotelesByIdUser"}/${idUser}`)
  }

  
}
