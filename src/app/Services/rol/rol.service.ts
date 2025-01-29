import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Rol } from './rol';
import { Observable } from 'rxjs';
import { environment } from '../../../enviroments/enviroment';

@Injectable({
  providedIn: 'root'
})
export class RolService {

  constructor(private http: HttpClient) { }
  
    getTodosRestaurantes(): Observable<Rol[]> {
      return this.http.get<Rol[]>(environment.urlHost + "/rol");
    }
}
