import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Etiquetas } from './categoriaLugar';
import { environment } from '../../../enviroments/enviroment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoriaLugarService {

  constructor(private http:HttpClient) {}


  getTodosLugares():Observable<Etiquetas[]>{
    return this.http.get<Etiquetas[]>(environment.urlHost + "/etiquetasLugares");
  }

}
