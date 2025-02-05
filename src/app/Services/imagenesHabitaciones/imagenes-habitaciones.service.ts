import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ImagenesHabitacion } from './imagenesHabitacion'; 
import { environment } from '../../../enviroments/enviroment';

@Injectable({
  providedIn: 'root',
})
export class ImagenesHabitacionesService {
  constructor(private http: HttpClient) {}

  getImagenesHabitacion(): Observable<ImagenesHabitacion[]> {
    return this.http.get<ImagenesHabitacion[]>(
      environment.urlHost + '/imageHabitacion'
    );
  }

  getImagenesByIdHabitacion(idHabitacion: number): Observable<ImagenesHabitacion[]> {
    return this.http.get<ImagenesHabitacion[]>(
      `${environment.urlHost + '/imageHabitacion'}/${idHabitacion}`
    );
  }

  uploadImage(file: File, idHabitacion: number): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<string>(
      `${environment.urlHost + '/imageHoteles'}/${idHabitacion}`, formData, { responseType: 'text' as 'json' }
    );
  }

  getFile(fileName: string) {
    return this.http.get(`${environment.urlHost + '/imageHoteles/file'}/${fileName}`, {
      responseType: 'blob', // Importante para manejar archivos binarios
    });
  }
}

