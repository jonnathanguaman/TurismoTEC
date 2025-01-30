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

    guardarAuth_RolAdmin(authRol:Auth_rol, idAuth:number, idRol:number):Observable<Auth_rol>{
      return this.http.post<Auth_rol>(`${environment.urlHost + "/auth_rol"}/${idAuth}/${idRol}`,authRol);
    }

    getRolesDeAuth(idAuth:number):Observable<Auth_rol[]>{
      return this.http.get<Auth_rol[]>(`${environment.urlHost + "/rolesByIdAuth"}/${idAuth}`)
    }

    elimarRolDelUsuario(id:number):Observable<Auth_rol>{
      return this.http.delete<Auth_rol>(`${environment.urlHost + "/auth_rol"}/${id}`)
    }
}
