import { Component } from '@angular/core';
import { AuthService } from '../../Services/login/login.service';

@Component({
  selector: 'app-menu-admin',
  templateUrl: './menu-admin.component.html',
  styleUrl: './menu-admin.component.css'
})
export class MenuAdminComponent {

  constructor(private loginService:AuthService){}

  cerrarSesion(){
    this.loginService.logOut()
  }
}
