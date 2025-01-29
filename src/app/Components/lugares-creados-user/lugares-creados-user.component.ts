import { Component, OnInit } from '@angular/core';
import { TokenPayload } from '../../Services/DatosPersonales/TokenPayload ';
import { jwtDecode } from 'jwt-decode';
import { AuthService } from '../../Services/login/login.service';
import { AuthRegisterService } from '../../Services/auth/authRegister.service';
import { Lugares } from '../../Services/Lugares/lugares';
import { LugaresService } from '../../Services/Lugares/lugares.service';
import { environment } from '../../../enviroments/enviroment';
import { ImagenesLugaresService } from '../../Services/ImagenesLugares/imagenes-lugares.service';

@Component({
  selector: 'app-lugares-creados-user',
  templateUrl: './lugares-creados-user.component.html',
  styleUrl: './lugares-creados-user.component.css',
})
export class LugaresCreadosUserComponent implements OnInit{
  constructor(
    private authService: AuthRegisterService,
    private lugarService:LugaresService,
    private imgLugaresService:ImagenesLugaresService,
  ) {}
  
  urlHost:string = environment.urlAut

  lugaresUser:Lugares[]
  
  
  ngOnInit(): void {
    this.obtenerLugaresDeUser()
  }

  obtenerLugaresDeUser() {
    const token = sessionStorage.getItem('token');
    const payload: TokenPayload = jwtDecode(token);
    this.authService.getIdPerson(payload.sub).subscribe({
      next: (idUser) => {
        console.log(idUser)
        this.lugarService.getLugaresByIdUser(idUser).subscribe({
          next:(lugares)=>{
            this.lugaresUser = lugares

            lugares.forEach((lugar)=>{
              this.imgLugaresService.getImagenesByIdLugares(lugar.idLugares).subscribe(imgLugares =>{
                lugar.imagenesLugars = imgLugares
              })
            })
          }
        })
      }
    });
  }
}
