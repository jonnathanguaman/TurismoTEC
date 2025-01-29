import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ImagenesHoteles } from './imagesHoteles'; 
import { environment } from '../../../enviroments/enviroment';

@Injectable({
  providedIn: 'root',
})
export class ImagenesHotelesService {
  constructor(private http: HttpClient) {}

  getImagenesHoteles(): Observable<ImagenesHoteles[]> {
    return this.http.get<ImagenesHoteles[]>(
      environment.urlHost + '/imageHoteles'
    );
  }

  getImagenesByIdHoteles(idHotel: number): Observable<ImagenesHoteles[]> {
    return this.http.get<ImagenesHoteles[]>(
      `${environment.urlHost + '/imageHoteles'}/${idHotel}`
    );
  }

  uploadImage(file: File, idHotel: number): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<string>(
      `${environment.urlHost + '/imageHoteles'}/${idHotel}`, formData, { responseType: 'text' as 'json' }
    );
  }

  getFile(fileName: string) {
    return this.http.get(`${environment.urlHost + '/imageHoteles/file'}/${fileName}`, {
      responseType: 'blob', // Importante para manejar archivos binarios
    });
  }
}

