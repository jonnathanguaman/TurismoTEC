import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../enviroments/enviroment';
import { ImagenesMesas } from './imagenesMesas';

@Injectable({
  providedIn: 'root',
})
export class ImagenesMesasService {
  constructor(private http: HttpClient) {}

  getImagenesMesa(): Observable<ImagenesMesas[]> {
    return this.http.get<ImagenesMesas[]>(
      environment.urlHost + '/imageMesa'
    );
  }

  getImagenesByIdMesa(idMesa: number): Observable<ImagenesMesas[]> {
    return this.http.get<ImagenesMesas[]>(
      `${environment.urlHost + '/imageMesa'}/${idMesa}`
    );
  }

  uploadImage(file: File, idMesa: number): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<string>(
      `${environment.urlHost + '/imageMesa'}/${idMesa}`, formData, { responseType: 'text' as 'json' }
    );
  }

  getFile(fileName: string) {
    return this.http.get(`${environment.urlHost + '/imageMesa/file'}/${fileName}`, {
      responseType: 'blob', // Importante para manejar archivos binarios
    });
  }
}

