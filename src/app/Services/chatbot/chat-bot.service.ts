import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../enviroments/enviroment';

@Injectable({
  providedIn: 'root'
})
export class ChatBotService {

  constructor(private http:HttpClient) {}
  
  queryDatabase(query: string): Observable<any> {
    const body = { query: query };  // El cuerpo de la solicitud
    // Realiza la petición POST al backend
    return this.http.post<any>(environment.urlAut + "/api/query", body);
  }

  
}
