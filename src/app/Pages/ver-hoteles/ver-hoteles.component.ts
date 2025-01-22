import { Component, Input, OnInit } from '@angular/core';
import { HotelesService } from '../../Services/hoteles/hoteles.service';
import { Hoteles } from '../../Services/hoteles/hoteles';
import { environment } from '../../../enviroments/enviroment';
import { ImagenesHoteles } from '../../Services/imagenesHoteles/imagesHoteles';
import { ImagenesHotelesService } from '../../Services/imagenesHoteles/imagenes-hoteles.service';
import { error } from 'console';

@Component({
  selector: 'app-ver-hoteles',
  templateUrl: './ver-hoteles.component.html',
  styleUrl: './ver-hoteles.component.css'
})
export class VerHotelesComponent implements OnInit{
  
  constructor(private hotelesService:HotelesService,
    private imgDeHotelService:ImagenesHotelesService
  ){}

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

          this.todoshoteles.forEach(hotel =>{
            this.obtenerImagesDeHoteles(hotel.idHotel).then(img => {
              hotel.imagenesHoteles = img
            })
          })
      })
    }

    obtenerImagesDeHoteles(idHoteles:number):Promise<ImagenesHoteles[]>{
      return new Promise((resolve,reject) =>{
          this.imgDeHotelService.getImagenesHoteles(idHoteles).subscribe(
            imgHoteles => resolve(imgHoteles),
            error => reject(error)
          )
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
