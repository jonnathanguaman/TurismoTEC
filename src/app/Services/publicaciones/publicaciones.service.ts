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

  guardarImagenDePublicacion(file: File, idPublicacion:number): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.put<string>(`${environment.urlHost + '/publicacionesImagen'}/${idPublicacion}`,formData);
  }

   //Obtenernos los archivos de las images por nombre de imagen 
   getFile(fileName: string) {
    return this.http.get(`${environment.urlHost + '/imagePerfilUsuario/file'}/${fileName}`, {
      responseType: 'blob', // Importante para manejar archivos binarios
    });
  }
}
