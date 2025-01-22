import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { LugaresService } from '../../Services/Lugares/lugares.service';
import { ActivatedRoute } from '@angular/router';
import { Lugares } from '../../Services/Lugares/lugares';
import { environment } from '../../../enviroments/enviroment';

@Component({
  selector: 'app-lugar',
  templateUrl: './lugar.component.html',
  styleUrl: './lugar.component.css'
})
export class LugarComponent implements OnInit{


  modalAbiertoMapa:boolean = false
  modalAbiertoHotel:boolean = false
  modalAbiertoRestaurante:boolean = false

  urlHost:string = environment.urlAut

  abrirMapa(){
    this.modalAbiertoMapa = true
  }

  cerrarMapa(){
    this.modalAbiertoMapa = false
  }

  abrirHoteles(){
    this.modalAbiertoHotel = true
  }

  cerrarHoteles(){
    this.modalAbiertoHotel = false
  }

  abrirRestaurantes(){
    this.modalAbiertoRestaurante= true
  }

  cerrarRestaurantes(){
    this.modalAbiertoRestaurante = false
  }

  location!: SafeResourceUrl;
  lugarEcontrado!:Lugares;
  
  constructor(private sanitizer: DomSanitizer, 
    private lugarService:LugaresService, private activedRouter:ActivatedRoute) {
  }

  ngOnInit(): void {
    this.obtenerLugar()
  }

  
  obtenerLugar(){
    this.activedRouter.params.subscribe(params =>{
      let id = params['id']
        if(id){
          this.lugarService.getLugarById(id).subscribe((lugar) => {
            this.lugarEcontrado = lugar
              const url = this.lugarEcontrado.direccion
              this.location = this.sanitizer.bypassSecurityTrustResourceUrl(url);
          })
        }
    })
  }
}
