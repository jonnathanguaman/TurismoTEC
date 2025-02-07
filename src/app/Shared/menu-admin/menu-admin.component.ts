import { Component } from '@angular/core';
import { AuthService } from '../../Services/login/login.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-menu-admin',
  templateUrl: './menu-admin.component.html',
  styleUrl: './menu-admin.component.css'
})
export class MenuAdminComponent {

  constructor(
    private loginService:AuthService,
    private router:Router,){}

  cerrarSesion(){
    this.loginService.logOut()
  }

  perfil(){
    // Quite el reload por si da un error
    this.router.navigateByUrl("/admin/crud-reservaciones-habitaciones")
  }
}
