import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../enviroments/enviroment';

@Injectable({
  providedIn: 'root'
})
export class MailService {

  constructor(private http:HttpClient) { }

  enviarCorreoAUsuario(idUsuario:number):Observable<any>{
    return this.http.post<any>(`${environment.urlHost + "/send-email"}/${idUsuario}`,null)
  }

  enviarCorreoAprobado(idUsuario:number):Observable<any>{
    return this.http.post<any>(`${environment.urlHost + "/send-email-aprobado"}/${idUsuario}`,null)
  }
}
