import { Component, OnInit } from '@angular/core';
import { DatosPersonalesService } from '../../Services/DatosPersonales/datos-personales.service';
import { Persona } from '../../Services/DatosPersonales/persona';
import { FormBuilder, FormsModule, Validators } from '@angular/forms';
import { Auth } from '../../Services/login/Auth';
import { AuthRegisterService } from '../../Services/auth/authRegister.service';
import { authRegister } from '../../Services/auth/authRegister';
import { environment } from '../../../enviroments/enviroment';
import { RolService } from '../../Services/rol/rol.service';
import { Rol } from '../../Services/rol/rol';
import { AuthRolService } from '../../Services/auth_Rol/auth-rol.service';
import { Auth_rol } from '../../Services/auth_Rol/auth_rol';

@Component({
  selector: 'app-crud-personas',
  templateUrl: './crud-personas.component.html',
  styleUrl: './crud-personas.component.css'
})
export class CrudPersonasComponent implements OnInit{

  isCrudModalOpen: boolean = false;
  personas:Persona[]
  constructor(
    private personaService:DatosPersonalesService,
    private fb:FormBuilder,
    private authRegisterService:AuthRegisterService,
    private rolService:RolService,
    private authRolService:AuthRolService,

  ){}

  ngOnInit(): void {
    this.obtenerPersonas()
  }


  personaForm = this.fb.group({
    id_Usuario:['',[Validators.required]],
    nombre:['',[Validators.required]],
    apellido:['',[Validators.required]],
    edad:['',[Validators.required]],
    paisOrigen:['',[Validators.required]],
    idioma:['',[Validators.required]],
    correo:['',[Validators.required, Validators.email]],
  })

  authForm = this.fb.group({
    id_auth:['',[Validators.required]],
    username:['',[Validators.required]],
    password:['',[Validators.required]],
    id_usuario:['',[Validators.required]],  
  })
  get nombre(){
    return this.personaForm.controls.nombre;
  }

  get apellido(){
    return this.personaForm.controls.apellido;
  }

  get edad(){
    return this.personaForm.controls.edad;
  }

  get paisOrigen(){
    return this.personaForm.controls.paisOrigen;
  }

  get idioma(){
    return this.personaForm.controls.idioma;
  }

  get correo(){
    return this.personaForm.controls.correo;
  }

  get username(){
    return this.authForm.controls.username;
  }
  get password(){
    return this.authForm.controls.password;
  }

  get id_auth(){
    return this.authForm.controls.id_auth
  }

  openCrudModal() {
    this.isCrudModalOpen = true;
  }

  closeCrudModal() {
    this.obtenerPersonas()
    this.isCrudModalOpen = false;
    this.personaForm.reset();
    this.authForm.reset();
  }

  obtenerPersonas(){
    this.personaService.getPersonas().subscribe((personas)=>{
      personas.forEach((persona)=>{
        this.authRegisterService.getAuthByIdPersona(persona.id_Usuario).subscribe({
          next:(auth)=>{
            persona.auth = auth
            this.personas = personas
          }})
      })
    })
  }

  editar:boolean = false
  
  editarUsuario(idUsuario:number){
    this.isCrudModalOpen = true;
    this.editar = true
    this.personaService.getPersonById(idUsuario).subscribe({
      next:(persona)=>{
        this.personaForm.controls.id_Usuario.setValue(persona.id_Usuario);
        this.personaForm.controls.nombre.setValue(persona.nombre);
        this.personaForm.controls.apellido.setValue(persona.apellido);
        this.personaForm.controls.edad.setValue(persona.edad);
        this.personaForm.controls.paisOrigen.setValue(persona.paisOrigen);
        this.personaForm.controls.idioma.setValue(persona.idioma);
        this.personaForm.controls.correo.setValue(persona.correo);
        this.obtenerAuthByIdUsuario(persona.id_Usuario);
      }
    })
  }

  obtenerAuthByIdUsuario(idUsuario:number){
    this.authRegisterService.getAuthByIdPersona(idUsuario).subscribe({
      next:(auth)=>{
        this.authForm.controls.id_auth.setValue(auth.id_auth)
        this.authForm.controls.id_usuario.setValue(auth.id_usuario)
        this.authForm.controls.password.setValue(auth.password)
        this.authForm.controls.username.setValue(auth.username)
      }
    })
  }


  crearEditarAuth(){
    // if(this.authForm.valid && this.personaForm.valid){
      if(this.editar){
        this.editarPersonaYauth()
      }else{
        this.crearPersonaAuth()
      }
    // }else{
    //   environment.mensajeToast('error','Faltan datos','Por favor ingrese todos los datos')
    // }
  }

  editarPersonaYauth(){
    this.personaService.guardarPesona(this.personaForm.value as unknown as Persona).subscribe({
      next:()=>{
        this.authRegisterService.editarAuth(this.username.value, this.password.value,<number><unknown> this.id_auth.value).subscribe({
          error:()=>{
            environment.mensajeToast('error','Ups ha ocurrido un error al modificar las credenciales','Sentimos los inconvenientes, hemos notificado el error a los responsable')
          }
        })
      },
      complete:()=>{
        this.closeCrudModal()
        environment.mensajeToast('success','Editado con exito','El usuario ha sido editado con exito')
      },
      error:()=>{
        environment.mensajeToast('error','Ups ha ocurrido un error','Sentimos los inconvenientes, hemos notificado el error a los responsable')
      }
    })
    
  }

  idAuth:number

  crearPersonaAuth(){
    this.personaService.guardarPesona(this.personaForm.value as unknown as Persona).subscribe({
      next:(persona)=>{
        this.authForm.controls.id_usuario.setValue(<string><unknown> persona.id_Usuario)
        this.authRegisterService.registerAuth(this.authForm.value as unknown as authRegister).subscribe({
          next:()=>{
            this.authRegisterService.getAuth(this.username.value).subscribe({
              next:(auth)=>{
                this.abrirModalRol(auth.id_auth)
                this.obtenerRoles()
                this.closeCrudModal()
              }
            })
            
          },
          error:()=>{
            environment.mensajeToast('error','Ups ha ocurrido un error al crear las credenciales','Sentimos los inconvenientes, hemos notificado el error a los responsable')
          }
        })
      },
      complete:()=>{
        
        environment.mensajeToast('success','Creado con exito','El usuario ha sido creado con exito')
      },
      error:()=>{
        environment.mensajeToast('error','Ups ha ocurrido un error','Sentimos los inconvenientes, hemos notificado el error a los responsable')
      }
    }
  )
  }

  elinimarPesona(idPersona:number, idAuth:number){
    environment.mensajeEmergente('Eliminar persona','¿Estas seguro que deseas eliminar a la persona?','warning')
    .then((confirmar) =>{
      if(confirmar){
        this.authRegisterService.eliminarAuth(idAuth).subscribe()
        this.personaService.eliminarPersona(idPersona).subscribe({
          next:()=>{
            this.obtenerPersonas()
            environment.mensajeToast(
              'success',
              'Eliminado con exito',
              'Se ha eliminado con exito'
          );
          },
          error:()=>{
            environment.mensajeToast(
              'error',
              'No se pudo eliminar',
              'No se ha podido eliminar porque esta relacionado con otros objetos'
          );
          }
        })
      }
    })
  }

  roles:Rol[]

  obtenerRoles(){this.rolService.getTodosRestaurantes().subscribe({next:(roles)=>{this.roles = roles}})}

  modalRoles = false

  cerrarModalRol(){
    this.modalRoles = false
  }

  abrirModalRol(id_auth:number){
    this.idAuth = id_auth
    this.modalRoles = true
    this.obtenerRoles()
    this.obtenerRolesDeAuth()
  }
  public auth_rol = new Auth_rol;

  asignarRol(idRol:number){
    
    this.authRolService.guardarAuth_RolAdmin(this.auth_rol,this.idAuth,idRol).subscribe({
      next:(rolAsiganado)=>{
        if(rolAsiganado == null){
          environment.mensajeToast('error','El usuario ya cuenta con ese rol','El usuario ya cuenta con ese r')
        }else{
          environment.mensajeToast('success','Rol asignado','El rol se asigno con exito')
        }
      },
      complete:()=>{
        this.obtenerRolesDeAuth()
      }
    })
  }

  rolesDeAuth:Auth_rol[]

  obtenerRolesDeAuth(){
    this.authRolService.getRolesDeAuth(this.idAuth).subscribe({
      next:(roles)=>{this.rolesDeAuth = roles}
    })
  }

  eliminarEtiqueta(IdAuthRol:number){
    environment.mensajeEmergente('¿Estás seguro que deseas quitarle el rol?','Esta operación no es reversible','warning')
    .then(()=>{
      this.authRolService.elimarRolDelUsuario(IdAuthRol).subscribe({
        complete:()=>{
          this.obtenerRolesDeAuth()
          environment.mensajeToast('success','Eliminado con exito','Se ha eliminado con exito');
        }
      })
    })
  }
}
