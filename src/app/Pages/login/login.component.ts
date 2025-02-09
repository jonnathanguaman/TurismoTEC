import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../Services/login/login.service';
import { LoginRequest } from '../../Services/login/LoginRequest';
import { environment } from '../../../enviroments/enviroment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent{
 
  admin:boolean = false
  loginError:String=""

  constructor(private fb:FormBuilder,
    private router:Router,
    private loginService:AuthService,
    ){}
  
    ngOnInit(): void {

    }
  loginForm = this.fb.group({
    username:['',[Validators.required]],
    password:['',Validators.required]
  })

  get username(){
    return this.loginForm.controls.username;
  }

  get password(){
    return this.loginForm.controls.password;
  }


  login(){
    if(this.loginForm.valid){
      this.loginService.login(this.loginForm.value as unknown as LoginRequest).subscribe({
        next:()=>{
          this.loginService.getRoles()
          this.loginService.admin.subscribe(
            {
              next:(admin)=>{
                this.loginService.asociado.subscribe({
                    next:(asociado) =>{
                      console.log("admin: " + admin)
                      console.log("admin: " + asociado)
                      if(admin || asociado){
                        this.loginForm.reset()
                        this.router.navigateByUrl("/admin").then(()=>{window.location.reload()})
                        
                      }else{
                      this.router.navigateByUrl("/").then(()=>{window.location.reload()})
                      }
                    }
                })
              }
            }
          )
        },
        error:()=>{
          environment.mensajeToast("error","Credenciales invalidas","Usuario o contraseña incorrectas")
        },
        complete() {
          window.location.reload()
        },
        
      })
    }
    else{
      this.loginForm.markAllAsTouched();
      environment.mensajeToast("warning","Ingrese los datos","Ingrese el usuario y contraseña")
    }
  }


}
