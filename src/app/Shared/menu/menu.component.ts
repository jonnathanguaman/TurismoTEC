import { Component, ElementRef, ViewChild, HostListener, OnInit } from '@angular/core';
import { environment } from '../../../enviroments/enviroment';
import { AuthService } from '../../Services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit{
  menuAbierto: boolean = false;
  userloginOn:boolean = false;
  
  @ViewChild('menuItems') menuItems!: ElementRef;
  @ViewChild('menuToggle') menuToggle!: ElementRef;

  constructor(private loginService:AuthService, private router:Router){}

  ngOnInit(): void {
    this.loginService.currentUserLoginOn.subscribe(
      {
        next:(userloginOn) =>{
          this.userloginOn = userloginOn
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
