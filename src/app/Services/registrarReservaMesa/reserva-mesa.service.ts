import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ReservaMesa } from './reserva-mesa';
import { Observable } from 'rxjs';
import { environment } from '../../../enviroments/enviroment';

@Injectable({
  providedIn: 'root'
})
export class ReservaMesaService {

  constructor(private readonly http:HttpClient) {}

  registarReserva(reserva:ReservaMesa, idUsuario:number, idMesa:number):Observable<ReservaMesa>{
    return this.http.post<ReservaMesa>(`${environment.urlHost + "/reservaMesa"}/${idUsuario}/${idMesa}`,reserva)
  }

  obtenerHorasOcupadasByMesaAndFecha(fecha:string,idMesa:number):Observable<string[]>{
    return this.http.get<string[]>(`${environment.urlHost + "/horaReservada"}/${fecha}/${idMesa}`)
  }
}
