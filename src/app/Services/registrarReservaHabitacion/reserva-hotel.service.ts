import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ReservaHatitacion } from './reservaHotel';
import { environment } from '../../../enviroments/enviroment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReservaHotelService {

  constructor(private http:HttpClient) {}

  guardarReservaHabitacion(reservaHatitacion:ReservaHatitacion, idusuario:number, idHabitacion:number):Observable<ReservaHatitacion>{
    return this.http.post<ReservaHatitacion>(`${environment.urlHost + "/reservasHabitaciones"}/${idusuario}/${idHabitacion}`,reservaHatitacion);
  }

  getFechasReservadas(idHabitacion:number):Observable<any>{
    return this.http.get<any>(`${environment.urlHost + "/fechasReservadas"}/${idHabitacion}`);
  }

  getReservasHabitaciones():Observable<ReservaHatitacion[]>{
    return this.http.get<ReservaHatitacion[]>(environment.urlHost + "/reservasHabitaciones");
}
}
