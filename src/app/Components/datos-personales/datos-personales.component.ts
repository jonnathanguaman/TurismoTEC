import { Component, OnInit } from '@angular/core';
import { DatosPersonalesService } from '../../Services/DatosPersonales/datos-personales.service';
import { AuthRegisterService } from '../../Services/auth/authRegister.service';
import { TokenPayload } from '../../Services/DatosPersonales/TokenPayload ';
import { jwtDecode } from 'jwt-decode';
import { AuthService } from '../../Services/login/login.service';
import { FormBuilder, Validators } from '@angular/forms';
import { DatosPersona } from '../../Services/DatosPersonales/datosPersonales';
import { authRegister } from '../../Services/auth/authRegister';

@Component({
  selector: 'app-datos-personales',
  templateUrl: './datos-personales.component.html',
  styleUrl: './datos-personales.component.css',
})
export class DatosPersonalesComponent implements OnInit {
  textBoton: String = 'Registrar';
  userloginOn: boolean = false;
  editar!: boolean;

  userId = <number>(<unknown>sessionStorage.getItem('id'));

  usuario: string = '';
  contrasena: string = '';
  nombre: string = '';
  apellido: string = '';
  idioma: string = '';
  pais: string = '';
  edad!: number;

  constructor(
    private datosService: DatosPersonalesService,
    private authService: AuthRegisterService,
    private loginService: AuthService
  ) {}

  public persona: DatosPersona = new DatosPersona();

  ngOnInit(): void {
    this.loginService.userLoginOn.subscribe({
      next: (userloginOn) => {
        this.userloginOn = userloginOn;
      },
    });

    if (this.userloginOn) {
      this.textBoton = 'Guardar';
      this.editar = true;
    }

    if (<number>(<unknown>sessionStorage.getItem('id'))) {
      const token = sessionStorage.getItem('token');

      if (token) {
        try {
          const payload: TokenPayload = jwtDecode(token);
          this.datosService.getPersonById(this.userId).subscribe((person) => {
            this.idioma = person.idioma;
            this.nombre = person.nombre;
            this.apellido = person.apellido;
            this.edad = person.edad;
            this.pais = person.paisOrigen;
          });

          this.authService.getAuth(payload.sub).subscribe((auth) => {
            this.contrasena = auth.password;
            this.usuario = auth.username;
          });
        } catch (error) {
          console.error('Error al decodificar el token:', error);
        }
      } else {
        console.error('No se encontró el token en sessionStorage.');
      }
    }
  }

  activarModoEditar() {
    this.editar = false;
  }

  desactivarModoEditar() {
    this.editar = true;
  }

  auth: authRegister = new authRegister();
  idauth!:number;
  registrarPersona() {
    //Validar que el usuario no se repita
    // this.authService.getAuth(this.usuario).subscribe({
      // next: (auxauthService) => {
        // this.idauth = auxauthService.id_auth
        // console.log(this.idauth)
        this.persona.nombre = this.nombre;
        this.persona.apellido = this.apellido;
        this.persona.edad = this.edad;
        this.persona.idioma = this.idioma;
        this.persona.paisOrigen = this.pais;
        if (this.userloginOn) {
          console.log('entro aqui');
          this.persona.id_Usuario = this.userId;
        }

        this.datosService.guardarPesona(this.persona).subscribe({
          next: (usuario) => {
            console.log('UsuarioGuardado');
            this.auth.username = this.usuario;
            this.auth.password = this.contrasena;
            this.auth.id_usuario = usuario.id_Usuario;
            // if(this.userloginOn){
            //   this.auth.id_auth = this.idauth;
            // console.log(this.auth.id_auth);
            // }
            this.authService.registerAuth(this.auth).subscribe({
              complete: () => {
                console.log('AuthRegistrado');
              },
            });
          },
        });
      // },
    // });
  }
}
