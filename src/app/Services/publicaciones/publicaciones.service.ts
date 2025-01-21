import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Publicaciones } from './publicaciones';
import { environment } from '../../../enviroments/enviroment';

@Injectable({
  providedIn: 'root'
})
export class PublicacionesService {
  
  constructor(private http:HttpClient) {}


  getPublicaciones():Observable<Publicaciones[]>{
      return this.http.get<Publicaciones[]>(environment.urlHost + "/publicaciones");
  }

  guardarPublicacion(publicaciones:Publicaciones, idusuario:number):Observable<Publicaciones>{
    return this.http.post<Publicaciones>(`${environment.urlHost + "/publicaciones"}/${idusuario}`,publicaciones);
  }


}
