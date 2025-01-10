import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, tap, throwError } from 'rxjs';
import { LoginRequest } from './LoginRequest';
import { environment } from '../../../enviroments/enviroment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  currentUserLoginOn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  currentUserData: BehaviorSubject<String> = new BehaviorSubject<String>("");


  constructor(private http:HttpClient) {
    if (typeof window !== 'undefined' && sessionStorage) {
      this.currentUserLoginOn = new BehaviorSubject<boolean>(sessionStorage.getItem("token") != null);
      this.currentUserData = new BehaviorSubject<String>(sessionStorage.getItem("token") || "");
    } else {
      this.currentUserLoginOn = new BehaviorSubject<boolean>(false);
      this.currentUserData = new BehaviorSubject<String>("");
    }  
  }

  login(credentials:LoginRequest):Observable<any>{
    return this.http.post<any>(environment.urlHost+"public/login",credentials).pipe(
      tap((userData) => {
        sessionStorage.setItem("token",userData.token)
        this.currentUserData.next(userData.token)
        this.currentUserLoginOn.next(true)
      }),
      map((userData) => userData.token),
      catchError(this.handleError)
    )
  }

  private handleError(error:HttpErrorResponse){
    if(error.status === 0){
      console.log('Se ha produciodo un error ' + error)
    }else{
      console.log('El backend retorno el codigo del error ' + error)
    }
    return throwError(() => new Error('Algo falló, Por fvor intente de nuevo'))
  }

  logOut():void{
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("id");
    this.currentUserLoginOn.next(false)
  }
  get userDate():Observable<String>{
    return this.currentUserData.asObservable();
  }

  get userLoginOn():Observable<boolean>{
    return this.currentUserLoginOn.asObservable();
  }

  get userToken():String{
      return this.currentUserData.value
  }
  
}
