import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Auth_rol } from './auth_rol';
import { Observable } from 'rxjs';
import { environment } from '../../../enviroments/enviroment';

@Injectable({
  providedIn: 'root'
})
export class AuthRolService {

  constructor(private http:HttpClient) {}

    guardarAuth_Rol(authRol:Auth_rol, idAuth:number):Observable<Auth_rol>{
      
      return this.http.post<Auth_rol>(`${environment.urlHost + "/auth_rol"}/${idAuth}/${1}`,authRol);
    }
}
