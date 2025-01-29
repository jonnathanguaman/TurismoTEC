import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Hoteles } from './hoteles';
import { environment } from '../../../enviroments/enviroment';

@Injectable({
  providedIn: 'root'
})
export class HotelesService {

  constructor(private http:HttpClient) { }

  getTodosHoteles():Observable<Hoteles[]>{
    return this.http.get<Hoteles[]>(environment.urlHost +"/hotel")
  }

  getHotelById(id:number):Observable<Hoteles>{
    return this.http.get<Hoteles>(`${environment.urlHost + "/hotel"}/${id}`)
  } 

  gethotelesDeLugar(id:number):Observable<Hoteles[]>{
    return this.http.get<Hoteles[]>(`${environment.urlHost + "/hotelesDeLugar"}/${id}`)
  }

  guardarLugares(hotel: Hoteles): Observable<Hoteles> {
      return this.http.post<Hoteles>(environment.urlHost + "/hotel", hotel)
    }

  eliminarHotel(id:number):Observable<Hoteles>{
      return this.http.delete<Hoteles>(`${environment.urlHost + "/hotel"}/${id}`)
    }
}
