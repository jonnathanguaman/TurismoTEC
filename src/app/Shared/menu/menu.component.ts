import { Component, ElementRef, ViewChild, HostListener, OnInit } from '@angular/core';
import { environment } from '../../../enviroments/enviroment';
import { AuthService } from '../../Services/login/login.service';
import { Router } from '@angular/router';
import { A } from 'ol/renderer/webgl/FlowLayer';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit{
  menuAbierto: boolean = false;
  userloginOn:boolean = false;
  admin:boolean = false;
  user:boolean = true;

  @ViewChild('menuItems') menuItems!: ElementRef;
  @ViewChild('menuToggle') menuToggle!: ElementRef;

  constructor(private loginService:AuthService, private router:Router){}

  ngOnInit(): void {
    this.loginService.getRoles()

    this.loginService.userLoginOn.subscribe(
      {
        next:(userloginOn) =>{
          this.userloginOn = userloginOn
        }
      }
    )

    this.loginService.admin.subscribe(
      {
        next:(admin) =>{
          this.admin = admin
        }
      }
    )
  }

  toggleMenu(event: Event) {
    event.stopPropagation(); 
    this.menuAbierto = !this.menuAbierto;
  }

  @HostListener('document:click', ['$event'])
  closeMenuIfClickedOutside(event: MouseEvent) {
    const menu = this.menuItems?.nativeElement;
    const toggle = this.menuToggle?.nativeElement;

    if (menu && toggle) {
      if (!menu.contains(event.target) && !toggle.contains(event.target)) {
        this.menuAbierto = false; 
      }
    }
  }

  ocultarMenuVal:boolean = false
  cerrarSesion(){
    this.loginService.logOut();
    this.router.navigate(['/login']);
  }

  ocultarMenu(){
    this.ocultarMenuVal = true
  }
}
