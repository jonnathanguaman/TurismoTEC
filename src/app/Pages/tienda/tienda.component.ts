import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tienda',
  templateUrl: './tienda.component.html',
  styleUrl: './tienda.component.css'
})
export class TiendaComponent {

  constructor(private router:Router){}
  
  verProducto(){
    this.router.navigate(["/producto"])
  }
}
