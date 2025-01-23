import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Categoria } from './categoriaLugar';
import { environment } from '../../../enviroments/enviroment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoriaLugarService {

  constructor(private http:HttpClient) {}


  getTodosLugares():Observable<Categoria[]>{
    return this.http.get<Categoria[]>(environment.urlHost + "/categorias");
  }

}
