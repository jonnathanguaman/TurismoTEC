import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../enviroments/enviroment';
import { DatosPersona } from './datosPersonales';
import { Persona } from './persona';

@Injectable({
  providedIn: 'root'
})
export class DatosPersonalesService {

  constructor(private http:HttpClient) { }

  guardarPesona(datosPersonales:DatosPersona):Observable<DatosPersona>{
    return this.http.post<DatosPersona>(environment.urlAut+"/public/api/usuario",datosPersonales)
  }

  actualizarPersona(datosPersonales:DatosPersona,idPersona:number):Observable<DatosPersona>{
    return this.http.put<DatosPersona>(`${environment.urlAut+"/public/api/usuario"}/${idPersona}`,datosPersonales)
  }
  getPersonById(id:number):Observable<any>{
    return this.http.get<any>(`${environment.urlAut+"/public/api/usuario"}/${id}`)
  }

  getPersonas():Observable<Persona[]>{
    return this.http.get<Persona[]>(environment.urlAut+"/public/api/usuario")
  }

  eliminarPersona(idPersona:number):Observable<DatosPersona>{
    return this.http.delete<DatosPersona>(`${environment.urlAut+"/public/api/usuario"}/${idPersona}`)
  }

}
