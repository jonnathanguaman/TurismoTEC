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
import { AuthRolService } from '../../Services/auth_Rol/auth-rol.service';
import { Auth_rol } from '../../Services/auth_Rol/auth_rol';
import { LoginRequest } from '../../Services/login/LoginRequest';
import { Router } from '@angular/router';

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
  correo:string=''

  constructor(
    private datosService: DatosPersonalesService,
    private authService: AuthRegisterService,
    private loginService: AuthService,
    private authRolService:AuthRolService,
    private fb:FormBuilder,
    private router:Router,
  ) {}

  public persona: DatosPersona = new DatosPersona();
  public auth_Rol:Auth_rol = new Auth_rol()

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


  loginForm = this.fb.group({
    username:['',[Validators.required]],
    password:['',Validators.required]
  })


  registrarPersona() {
    this.persona.nombre = this.nombre;
    this.persona.apellido = this.apellido;
    this.persona.edad = this.edad;
    this.persona.idioma = this.idioma;
    this.persona.paisOrigen = this.pais;
    this.persona.correo = this.correo;
    this.datosService.guardarPesona(this.persona).subscribe({
      next: (usuario) => {
        this.auth.username = this.usuario;
        this.auth.password = this.contrasena;
        this.auth.id_usuario = usuario.id_Usuario;
        this.authService.registerAuth(this.auth).subscribe({
          next: () => {
            this.authService.getAuth(this.auth.username).subscribe({
              next:(auth)=>{
                this.authRolService.guardarAuth_Rol(this.auth_Rol,auth.id_auth).subscribe({
                  next:() =>{
                    environment.mensajeToast("success","Usuario registrado","Se ha registrado con exito")
                    this.loginForm.controls.username.setValue(this.auth.username)
                    this.loginForm.controls.password.setValue(this.auth.password)
                  },
                  complete:()=>{
                    this.loginService.login(this.loginForm.value as unknown as LoginRequest).subscribe({
                      next:()=>{
                        this.loginService.getRoles()
                      },
                      complete:()=>{
                        this.router.navigateByUrl("/")
                      },
                      error:()=>{
                        console.log("No pudiste entrar lo siento")
                      }
                    })
                  }
                })
              }
            })

          },
        });
      },
    });
  }
}
