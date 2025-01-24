import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Lugares_categoria } from './lugares_categrias';
import { environment } from '../../../enviroments/enviroment';

@Injectable({
  providedIn: 'root'
})
export class LugaresCategoriasService {

   constructor(private http:HttpClient) { }
  
    getImagenesHoteles(idCategoria:number):Observable<Lugares_categoria[]>{
        return this.http.get<Lugares_categoria[]>(`${environment.urlHost + "/lugaresCategoriasFilter"}/${idCategoria}`)
      }
}
