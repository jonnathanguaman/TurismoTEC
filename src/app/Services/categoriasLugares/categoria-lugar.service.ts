import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EtiquetasLugar } from './categoriaLugar';
import { environment } from '../../../enviroments/enviroment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoriaLugarService {

  constructor(private http:HttpClient) {}

  crearEtiquetaLugar(etiqueta:EtiquetasLugar):Observable<EtiquetasLugar>{
    return this.http.post<EtiquetasLugar>(environment.urlHost+ "/etiquetasLugares", etiqueta)
  }

  getEtiquetaLugar():Observable<EtiquetasLugar[]>{
    return this.http.get<EtiquetasLugar[]>(environment.urlHost + "/etiquetasLugares");
  }

  obtenerEtiquetaById(id:number):Observable<EtiquetasLugar>{
    return this.http.get<any>(`${environment.urlHost+"/etiquetasLugares"}/${id}`)
  }

  editarEtiquetaLugar(etiqueta:EtiquetasLugar):Observable<EtiquetasLugar>{
    return this.http.post<any>(environment.urlHost+"/etiquetasLugares",etiqueta)
  }

  eliminarEtiquetaLugar(id:number):Observable<EtiquetasLugar>{
     return this.http.delete<EtiquetasLugar>(`${environment.urlHost + "/etiquetasLugares"}/${id}`)
  }
}
