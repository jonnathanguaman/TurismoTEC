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

  //Obtenemos todos los lugares que sean publicos 
  getTodosLugares():Observable<Lugares[]>{
    return this.http.get<Lugares[]>(environment.urlHost + "/lugaresPublicos");
  }

  //Obtenermos la lista general de los lugares
  getLugaresAdmin():Observable<Lugares[]>{
    return this.http.get<Lugares[]>(environment.urlHost + "/lugares");
  }

  //Obtenemos el lugar por id
  getLugarById(id:number):Observable<Lugares>{
    return this.http.get<Lugares>(`${environment.urlHost + "/lugares"}/${id}`)
  }

  //Guardamos los luagres
  guardarLugares(lugares:Lugares,idUser:number):Observable<Lugares>{
    return this.http.post<Lugares>(`${environment.urlHost + "/lugares"}/${idUser}`,lugares)
  }

  eliminarLugar(id:number):Observable<Lugares>{
    return this.http.delete<Lugares>(`${environment.urlHost + "/lugares"}/${id}`)
  }

  //Obtener los lugares por el nombre del usuario, para mostrar en el perfil que lugares creo esa persona 
  getLugaresByIdUser(idUser:number):Observable<Lugares[]>{
    return this.http.get<Lugares[]>(`${environment.urlHost + "/lugaresByIdUser"}/${idUser}`)
  }

  //Aprobamos los lugares para que todos vean
  aprobarLugar(id: number, aprobado: boolean): Observable<Lugares> {
    return this.http.patch<Lugares>(`${environment.urlHost}/lugares/${id}`, { aprobado });
  }
  
}
