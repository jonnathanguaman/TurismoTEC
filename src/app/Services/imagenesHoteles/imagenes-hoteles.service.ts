import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ImagenesHoteles } from './imagesHoteles';
import { environment } from '../../../enviroments/enviroment';

@Injectable({
  providedIn: 'root'
})
export class ImagenesHotelesService {

  constructor(private http:HttpClient) { }

  getImagenesHoteles(id:number):Observable<ImagenesHoteles[]>{
      return this.http.get<ImagenesHoteles[]>(`${environment.urlHost + "/imageHoteles"}/${id}`)
    }
}
