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
    return this.http.get<Lugares[]>(environment.urlHost + "/lugares");
  }

  getLugarById(id:number):Observable<Lugares>{
    return this.http.get<Lugares>(`${environment.urlHost + "/lugares"}/${id}`)
  }
}
