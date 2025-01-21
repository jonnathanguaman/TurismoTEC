import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Comentario } from './comentario';
import { Observable } from 'rxjs';
import { environment } from '../../../enviroments/enviroment';

@Injectable({
  providedIn: 'root'
})
export class ComentarioService {

  constructor(private http:HttpClient) {}

  guardarComentario(comentario:Comentario, idusuario:number, idPublicaciones:number):Observable<Comentario>{
    return this.http.post<Comentario>(`${environment.urlHost + "/comentarios"}/${idusuario}/${idPublicaciones}`,comentario);
  }

  obtenerComentarioDePublicacion(idPublicacion:number):Observable<Comentario[]>{
    return this.http.get<Comentario[]>(`${environment.urlHost + "/comentariosDePublicacion"}/${idPublicacion}`)
  }
}
