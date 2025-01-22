import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImagenesInicioService {

  private apiUrl = 'http://localhost:8080/public/v1/imageInicio'; // URL del backend

  constructor(private http: HttpClient) {}

  // Método para obtener las imágenes
  getImagenes(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
}
