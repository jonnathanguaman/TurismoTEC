import { Component, ElementRef, ViewChild, HostListener } from '@angular/core';
import { environment } from '../../../enviroments/enviroment';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent {
  menuAbierto: boolean = false;
  registro:boolean = environment.registrado;
  
  @ViewChild('menuItems') menuItems!: ElementRef;
  @ViewChild('menuToggle') menuToggle!: ElementRef;

  constructor() {}

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
    this.registro = false
  }

  ocultarMenu(){
    this.ocultarMenuVal = true
  }
}
