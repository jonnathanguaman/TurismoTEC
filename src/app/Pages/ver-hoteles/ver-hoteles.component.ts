import { Component, Input, OnInit } from '@angular/core';
import { HotelesService } from '../../Services/hoteles/hoteles.service';
import { Hoteles } from '../../Services/hoteles/hoteles';
import { environment } from '../../../enviroments/enviroment';

@Component({
  selector: 'app-ver-hoteles',
  templateUrl: './ver-hoteles.component.html',
  styleUrl: './ver-hoteles.component.css'
})
export class VerHotelesComponent implements OnInit{
  
  constructor(private hotelesService:HotelesService){}

  @Input() idLugar?:number

  todoshoteles:Hoteles[]=[]
  nombreHotelBuscado:string=''
  urlHost:string = environment.urlAut;

  ngOnInit(): void {
    if(this.idLugar){
      this.obtenerHotelesDeLugar(this.idLugar)
    }else{
      this.obtenerTodosHoteles()
    }
  }

    obtenerTodosHoteles(){
      this.hotelesService.getTodosHoteles().subscribe(hoteles =>{
        this.todoshoteles = hoteles
      })
    }

  obtenerHotelesDeLugar(id:number){
    this.hotelesService.gethotelesDeLugar(id).subscribe(auxHotelesDeLugar =>{
      this.todoshoteles = auxHotelesDeLugar
    })
  }

  
  filtrarHoteles() {
    const nombreLower = this.nombreHotelBuscado.toLowerCase();
    this.hotelesService.getTodosHoteles().subscribe(hoteles =>{
      this.todoshoteles = hoteles.filter((hotel) =>
        hotel.nombre.toLowerCase().includes(nombreLower)
      )
    })
  }

  filtrarHotelesRecomendaciones() {
    const nombreLower = this.nombreHotelBuscado.toLowerCase();
    this.hotelesService.gethotelesDeLugar(this.idLugar!).subscribe(hoteles =>{
      this.todoshoteles = hoteles.filter((hotel) =>
        hotel.nombre.toLowerCase().includes(nombreLower)
      )
    })
  }
}
