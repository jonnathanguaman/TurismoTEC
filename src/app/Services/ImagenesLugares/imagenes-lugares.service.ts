import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ImagenesLugares } from './imagenesLugares';
import { Observable } from 'rxjs';
import { environment } from '../../../enviroments/enviroment';

@Injectable({
  providedIn: 'root',
})
export class ImagenesLugaresService {
  constructor(private http: HttpClient) {}


  getImgesLugares(): Observable<ImagenesLugares[]> {
    return this.http.get<ImagenesLugares[]>(
      environment.urlHost + '/imageLugares'
    );
  }

  //Obtenemos las imagenes que le pertenecen a un lugar en especifico
  getImagenesByIdLugares(idLugar: number): Observable<ImagenesLugares[]> {
    return this.http.get<ImagenesLugares[]>(
      `${environment.urlHost + '/imageLugares'}/${idLugar}`
    );
  }

  //Subimos las imagnes a la base de datos
  uploadImage(file: File, idLugar:number): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<string>(
     `${environment.urlHost + '/imageLugares'}/${idLugar}`,formData,{ responseType: 'text' as 'json' }
    );
  }

  //Obtenernos los archivos de las images por nombre de imagen 
  getFile(fileName: string) {
    return this.http.get(`${environment.urlHost + '/imageLugares/file'}/${fileName}`, {
      responseType: 'blob', // Importante para manejar archivos binarios
    });
  }
}
