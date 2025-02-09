import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../Services/login/login.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-menu-admin',
  templateUrl: './menu-admin.component.html',
  styleUrl: './menu-admin.component.css'
})
export class MenuAdminComponent implements OnInit{

  asociado:boolean = false
  textoDash:string = "Administrador"
  constructor(
    private loginService:AuthService){}

  ngOnInit(): void {
    this.loginService.asociado.subscribe(
      {
        next:(asociado) =>{
          this.asociado = asociado
        }
      }
    )
    if(this.asociado){
      this.textoDash = "Asociado"
    }
  }

  cerrarSesion(){
    this.loginService.logOut()
  }

  // perfil(){
  //   this.router.navigateByUrl("/admin/crud-reservaciones-habitaciones").then(()=>{
  //     window.location.reload()
  //   })
  // }
}
