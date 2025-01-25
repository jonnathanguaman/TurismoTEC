import { Component, OnInit } from '@angular/core';
import { AuthService } from './Services/login/login.service';
import { Router } from 'express';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{

  admin:boolean = false

  constructor(private loginService:AuthService){}
  
    ngOnInit(): void {
      this.loginService.getRoles()
  
      this.loginService.admin.subscribe(
        {
          next:(admin) =>{
            this.admin = admin
          }
        }
      )
    }

  
  
}
