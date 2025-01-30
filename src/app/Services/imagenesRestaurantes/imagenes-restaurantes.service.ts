import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ImagenesRestaurantes } from './imagenesRestaurantes';
import { environment } from '../../../enviroments/enviroment';

@Injectable({
  providedIn: 'root',
})
export class ImagenesRestaurantesService {
  constructor(private http: HttpClient) {}

  getImagenesRestaurantes(): Observable<ImagenesRestaurantes[]> {
    return this.http.get<ImagenesRestaurantes[]>(
      environment.urlHost + '/imageRestaurantes'
    );
  }

  getImagenesByIdRestaurantes(idRestaurante: number): Observable<ImagenesRestaurantes[]> {
    return this.http.get<ImagenesRestaurantes[]>(
      `${environment.urlHost + '/imageRestaurante'}/${idRestaurante}`
    );
  }

  uploadImage(file: File, idRestaurante: number): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<string>(
      `${environment.urlHost + '/imageRestaurantes'}/${idRestaurante}`, formData, { responseType: 'text' as 'json' }
    );
  }

  getFile(fileName: string) {
    return this.http.get(`${environment.urlHost + '/imageRestaurantes/file'}/${fileName}`, {
      responseType: 'blob', // Importante para manejar archivos binarios
    });
  }
}
