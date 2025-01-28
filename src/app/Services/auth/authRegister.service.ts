import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../enviroments/enviroment';
import { authRegister } from './authRegister';
import { TokenPayload } from '../DatosPersonales/TokenPayload ';
import { jwtDecode } from 'jwt-decode';
import { Auth } from '../login/Auth';

@Injectable({
  providedIn: 'root',
})
export class AuthRegisterService {
  constructor(private http: HttpClient) {}

  registerAuth(auth: authRegister): Observable<any> {
    return this.http.post<any>(environment.urlAut + '/public/v1/auth', auth);
  }

  getAuth(nombre: String): Observable<any> {
    return this.http.get<any>(
      `${environment.urlAut + '/public/v1/authGet'}/${nombre}`
    );
  }

  getIdPerson(nombre: String): Observable<any> {
    return this.http.get<any>(
      `${environment.urlAut + '/public/v1/authGetId'}/${nombre}`
    );
  }

  getAuthById(id: number): Observable<any> {
    return this.http.get<any>(
      `${environment.urlAut + '/public/v1/auth'}/${id}`
    );
  }

  getAuthByIdPersona(idPersona:number):Observable<any>{
    return this.http.get<any>(`${environment.urlAut + '/public/v1/authByIdUser'}/${idPersona} `)
  }
  
  editarAuth(user:string,password:string,id:number): Observable<any> {
    return this.http.patch<any>(`${environment.urlAut + '/public/v1/auth'}/${user}/${password}/${id}`, null);
  }
}
