import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Lugares } from './lugares';
import { environment } from '../../../enviroments/enviroment';

@Injectable({
  providedIn: 'root'
})
export class LugaresService {

  constructor(private http:HttpClient) {}

  getTodosLugares():Observable<Lugares[]>{
    return this.http.get<Lugares[]>(environment.urlHost + "/lugaresPublicos");
  }

  getLugaresAdmin():Observable<Lugares[]>{
    return this.http.get<Lugares[]>(environment.urlHost + "/lugares");
  }

  getLugarById(id:number):Observable<Lugares>{
    return this.http.get<Lugares>(`${environment.urlHost + "/lugares"}/${id}`)
  }

  guardarLugares(lugares:Lugares,idUser:number):Observable<Lugares>{
    return this.http.post<Lugares>(`${environment.urlHost + "/lugares"}/${idUser}`,lugares)
  }

  eliminarLugar(id:number):Observable<Lugares>{
    return this.http.delete<Lugares>(`${environment.urlHost + "/lugares"}/${id}`)
  }

  getLugaresByIdUser(idUser:number):Observable<Lugares[]>{
    return this.http.get<Lugares[]>(`${environment.urlHost + "/lugaresByIdUser"}/${idUser}`)
  }

  aprobarLugar(id: number, aprobado: boolean): Observable<Lugares> {
    return this.http.patch<Lugares>(`${environment.urlHost}/lugares/${id}`, { aprobado });
  }
  
}
