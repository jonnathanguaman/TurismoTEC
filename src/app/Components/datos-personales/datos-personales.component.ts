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
  
  isCrudModalOpen: boolean = false;
  isCrudModalUsernameOpen:boolean=false
  textBoton: String = 'Registrar';
  userloginOn: boolean = false;
  editar!: boolean;

  idAuth:number;
  userId: number;

  usuario: string = '';
  contrasena: string = '';
  nombre: string = '';
  apellido: string = '';
  idioma: string = '';
  pais: string = '';
  fechaNacimiento!: Date;
  correo:string=''

  closeCrudModalPassword() {
    this.isCrudModalOpen = false
  }

  openCrudModalPassword() {
    this.isCrudModalOpen = true;
  }

  closeCrudModalUsername() {
    this.isCrudModalUsernameOpen = false
  }
  
  openCrudModalUsername() {
    this.isCrudModalUsernameOpen = true;
  }
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
              const fechaSeleccionada = new Date(person.fechaNacimiento);
              const fechaISO = new Date(fechaSeleccionada.getTime() - 1).toISOString().split('T')[0]
              this.fechaNacimiento = <Date><unknown>fechaISO;
              this.pais = person.paisOrigen;
              this.correo = person.correo;
              this.userId = person.id_Usuario
            });

            this.authService.getAuth(payload.sub).subscribe((auth) => {
              this.idAuth = auth.id_auth
              this.usuario = auth.username
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

    let fechaSeleccionadaValidar = new Date(this.fechaNacimiento);
    let hoy = new Date();
    let edad = hoy.getFullYear() - fechaSeleccionadaValidar.getFullYear();
    
    if (hoy.getMonth() < fechaSeleccionadaValidar.getMonth() || 
        (hoy.getMonth() === fechaSeleccionadaValidar.getMonth() && hoy.getDate() < fechaSeleccionadaValidar.getDate())) {
      edad--;
    }

    if (edad < 18) {
      environment.mensajeToast('error', 'Edad inválida', 'Debes ser mayor de 18 años');
      return;
    }else{
    this.persona.nombre = this.nombre;
    this.persona.apellido = this.apellido;
    
    //Fecha formateada
    let fechaSeleccionada = new Date(this.fechaNacimiento);

    this.persona.fechaNacimiento = (new Date(fechaSeleccionada.setDate(fechaSeleccionada.getDate() + 1)))
    this.persona.idioma = this.idioma;
    this.persona.paisOrigen = this.pais;
    this.persona.correo = this.correo;
    console.log(this.persona)
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

  actualizarPersona(){
    let fechaSeleccionadaValidar = new Date(this.fechaNacimiento);
    let hoy = new Date();
    let edad = hoy.getFullYear() - fechaSeleccionadaValidar.getFullYear();
    
    if (hoy.getMonth() < fechaSeleccionadaValidar.getMonth() || 
        (hoy.getMonth() === fechaSeleccionadaValidar.getMonth() && hoy.getDate() < fechaSeleccionadaValidar.getDate())) {
      edad--;
    }

    if (edad < 18) {
      environment.mensajeToast('error', 'Edad inválida', 'Debes ser mayor de 18 años');
      return;
    }else{

    this.persona.nombre = this.nombre;
    this.persona.apellido = this.apellido;
    
    //Formateo de la fecha
    let fechaSeleccionada = new Date(this.fechaNacimiento);
    
    this.persona.fechaNacimiento = (new Date(fechaSeleccionada.setDate(fechaSeleccionada.getDate() + 1)));
    this.persona.idioma = this.idioma;
    this.persona.paisOrigen = this.pais;
    this.persona.correo = this.correo;
    console.log(this.persona)
    this.datosService.actualizarPersona(this.persona,this.userId).subscribe({
      next:()=>{
        environment.mensajeToast('success','Editado con exito','Los datos del usuario han sido editados con exito')
      }
    })
  }
  }

  actualizarPassword(){
    if(this.contrasena){
      environment.mensajeEmergente('Actualizar contraseña','¿Estas seguro que deseas actualizar la contraseña?','warning').then(
        (confirmar)=>{
          if(confirmar){
            this.auth.password = this.contrasena
            this.authService.editarAuthPassword(this.auth, this.idAuth).subscribe({
              next:()=>{
                environment.mensajeConfirmacion( 'Contraseña actualizada', 'Tu contraseña se ha actualizado correctamente. La sesión se cerrará por seguridad.', 'success' ).then(()=>{
                  this.loginService.logOut()
                })
              }
            })
          }
      })
    }else{
      environment.mensajeToast('warning','Ingrese la contraseña','')
    }
  }

  authUser: authRegister = new authRegister();
  actualizarUsername(){
    if(this.usuario){
    environment.mensajeEmergente('Actualizar contraseña','¿Estas seguro que deseas actualizar la contraseña?','warning').then(
      (confirmar)=>{
        if(confirmar){
          this.authUser.username = this.usuario
          console.log(this.authUser)
          this.authService.editarAuthUsermane(this.authUser, this.idAuth).subscribe({
            next:()=>{
              environment.mensajeConfirmacion( 'Usuario actualizada', 'Tu usuario se ha actualizado correctamente. La sesión se cerrará por seguridad.', 'success' ).then(()=>{
                this.loginService.logOut()
              })
            }
          })
        }
    })
    }else{
      environment.mensajeToast('warning','Ingrese el usuario','')
  }
  }
}
