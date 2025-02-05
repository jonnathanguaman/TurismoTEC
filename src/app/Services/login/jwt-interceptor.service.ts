import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './login.service';

@Injectable({
  providedIn: 'root'
})
export class JwtInterceptorService implements HttpInterceptor{

  constructor(private loginService:AuthService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let token:String = this.loginService.userToken

    if (req.body instanceof FormData) {
      // Si es FormData, no modificar Content-Type
      req = req.clone({
        setHeaders: {
          'Authorization': `Bearer ${token}`
        },
      });
    } else {
      // Si no es FormData, continuar con Content-Type JSON
      if (token != "") {
        req = req.clone({
          setHeaders: {
            'Content-Type': 'application/json;charset=utf-8',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        });
      }
    }
    return next.handle(req)
  }
}
