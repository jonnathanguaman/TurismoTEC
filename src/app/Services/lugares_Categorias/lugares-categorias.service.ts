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
  
    getLugaresEtiqueta(idCategoria:number):Observable<Lugares_categoria[]>{
        return this.http.get<Lugares_categoria[]>(`${environment.urlHost + "/lugaresCategoriasFilter"}/${idCategoria}`)
      }

    getCategoriasDelLugar(idLugar:number):Observable<Lugares_categoria[]>{
      return this.http.get<Lugares_categoria[]>(`${environment.urlHost + "/categoriasLugaresFilter"}/${idLugar}`)
    }
    
    crearLugareEtiqueta(lugarEtiqueta:Lugares_categoria,idLugar:number,idCategoria:number):Observable<Lugares_categoria>{
        return this.http.post<Lugares_categoria>(`${environment.urlHost + "/lugaresEtiquetas"}/${idLugar}/${idCategoria}`,lugarEtiqueta)
    }

    eliminarLugarEtiqueta(id:number):Observable<Lugares_categoria>{
         return this.http.delete<Lugares_categoria>(`${environment.urlHost + "/lugaresEtiquetas"}/${id}`)
    }
}
