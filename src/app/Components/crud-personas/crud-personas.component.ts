import { Component, OnInit } from '@angular/core';
import { DatosPersonalesService } from '../../Services/DatosPersonales/datos-personales.service';
import { Persona } from '../../Services/DatosPersonales/persona';
import { FormBuilder, FormsModule, Validators } from '@angular/forms';
import { Auth } from '../../Services/login/Auth';
import { AuthRegisterService } from '../../Services/auth/authRegister.service';
import { authRegister } from '../../Services/auth/authRegister';
import { environment } from '../../../enviroments/enviroment';

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
    private authRegisterService:AuthRegisterService){}

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

  editarUsuario(idUsuario:number){
    this.isCrudModalOpen = true;
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
 

  //Verificar por que no actualiza y arreglar la codificacion de la contraseña

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
}
