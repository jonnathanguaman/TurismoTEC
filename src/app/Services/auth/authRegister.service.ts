import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../enviroments/enviroment';
import { authRegister } from './authRegister';

@Injectable({
  providedIn: 'root'
})
export class AuthRegisterService {

  private httpHeaders = new HttpHeaders({'Content-Type': 'application/json'})
  constructor(private http:HttpClient) {}

  registerAuth(auth:authRegister):Observable<any>{
    return this.http.post<any>(environment.urlAut+"/public/v1/auth",auth,{headers:this.httpHeaders})
  }

  getAuth(nombre:String):Observable<any>{
    return this.http.get<any>(`${environment.urlAut+"/public/v1/authGet"}/${nombre}`)
  }

  getIdPerson(nombre:String):Observable<any>{
    return this.http.get<any>(`${environment.urlAut+"/public/v1/authGetId"}/${nombre}`)
  }
}
