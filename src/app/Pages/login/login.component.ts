import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../Services/login/login.service';
import { LoginRequest } from '../../Services/login/LoginRequest';
import { environment } from '../../../enviroments/enviroment';
import { authRegister } from '../../Services/auth/authRegister';
import { AuthRegisterService } from '../../Services/auth/authRegister.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  
  loginExitoso:boolean = false;
  loginError:String=""

  constructor(private fb:FormBuilder, private router:Router, private loginService:AuthService, private authRegisterService:AuthRegisterService){}

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
        next:() =>{
          this.loginExitoso = true;
          
        },
        error:(errorData) =>{
          this.loginError = errorData
        },
        complete:() =>{
          this.router.navigateByUrl("/")
          this.loginForm.reset()
        }
      })
    }
    else{
      this.loginForm.markAllAsTouched();
      alert("Error al ingresar los datos")
    }
  }
}
