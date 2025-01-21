import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ImagenesRestaurantes } from './imagenesRestaurantes';
import { Observable } from 'rxjs';
import { environment } from '../../../enviroments/enviroment';

@Injectable({
  providedIn: 'root'
})
export class ImagenesRestaurantesService {

  constructor(private http:HttpClient) { }
  
    getImagenesRestaurantes(id:number):Observable<ImagenesRestaurantes[]>{
        return this.http.get<ImagenesRestaurantes[]>(`${environment.urlHost + "/imageRestaurante"}/${id}`)
      }
}
