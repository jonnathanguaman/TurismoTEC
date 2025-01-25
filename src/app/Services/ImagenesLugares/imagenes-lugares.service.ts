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

  getImagenesByIdLugares(idLugar: number): Observable<ImagenesLugares[]> {
    return this.http.get<ImagenesLugares[]>(
      `${environment.urlHost + '/imageLugares'}/${idLugar}`
    );
  }

  uploadImage(file: File, idLugar:number): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<string>(
     `${environment.urlHost + '/imageLugares'}/${idLugar}`,formData,{ responseType: 'text' as 'json' }
    );
  }
}
