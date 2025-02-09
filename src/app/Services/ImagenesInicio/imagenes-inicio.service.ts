import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../enviroments/enviroment';

@Injectable({
  providedIn: 'root'
})
export class ImagenesInicioService {

  constructor(private http: HttpClient) {}

  // Método para obtener las imágenes
  getImagenes(): Observable<any> {
    return this.http.get<any>(environment.urlHost + "/imageInicio");
  }
}
