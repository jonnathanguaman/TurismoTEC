import { Component, OnInit } from '@angular/core';
import { DatosPersonalesService } from '../../Services/DatosPersonales/datos-personales.service';
import { AuthRegisterService } from '../../Services/auth/authRegister.service';
import { TokenPayload } from '../../Services/DatosPersonales/TokenPayload ';
import { jwtDecode } from 'jwt-decode';
import { AuthService } from '../../Services/login/login.service';
import { FormBuilder, Validators } from '@angular/forms';
import { DatosPersona } from '../../Services/DatosPersonales/datosPersonales';
import { authRegister } from '../../Services/auth/authRegister';
import { environment } from '../../../enviroments/enviroment';

@Component({
  selector: 'app-datos-personales',
  templateUrl: './datos-personales.component.html',
  styleUrl: './datos-personales.component.css',
})
export class DatosPersonalesComponent implements OnInit {
  textBoton: String = 'Registrar';
  userloginOn: boolean = false;
  editar!: boolean;

  userId: number;

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

    const token = sessionStorage.getItem('token');

    if (token) {
      try {
        const payload: TokenPayload = jwtDecode(token);

        this.authService.getIdPerson(payload.sub).subscribe({
          next: (idUser) => {
            this.datosService.getPersonById(idUser).subscribe((person) => {
              this.idioma = person.idioma;
              this.nombre = person.nombre;
              this.apellido = person.apellido;
              this.edad = person.edad;
              this.pais = person.paisOrigen;
            });

            this.authService.getAuth(payload.sub).subscribe((auth) => {
              this.contrasena = auth.password;
              this.usuario = auth.username;
              console.log(auth.authorities);
            });
          },
        });
      } catch (error) {
        console.error('Error al decodificar el token:', error);
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

  //Crear el controlador para relacionar
  //Revisar el guardado
  registrarPersona() {
    this.persona.nombre = this.nombre;
    this.persona.apellido = this.apellido;
    this.persona.edad = this.edad;
    this.persona.idioma = this.idioma;
    this.persona.paisOrigen = this.pais;
    this.datosService.guardarPesona(this.persona).subscribe({
      next: (usuario) => {
        this.auth.username = this.usuario;
        this.auth.password = this.contrasena;
        this.auth.id_usuario = usuario.id_Usuario;
        this.authService.registerAuth(this.auth).subscribe({
          next: () => {
            environment.mensajeToast("success","Usuario registrado","Se ha registrado con exito")
          },
        });
      },
    });
  }
}
