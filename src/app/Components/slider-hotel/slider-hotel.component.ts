import { Component, Input, OnInit } from '@angular/core';
import { ImagenesHotelesService } from '../../Services/imagenesHoteles/imagenes-hoteles.service';
import { ImagenesHoteles } from '../../Services/imagenesHoteles/imagesHoteles';
import { environment } from '../../../enviroments/enviroment';

@Component({
  selector: 'app-slider-hotel',
  templateUrl: './slider-hotel.component.html',
  styleUrl: './slider-hotel.component.css'
})
export class SliderHotelComponent implements OnInit{

  @Input() idHotel?:number

  constructor(private imgHotelesService:ImagenesHotelesService){}

  imgHoteles!:ImagenesHoteles[]
  urlHost:string = environment.urlAut;

  ngOnInit(): void {
    if(this.idHotel){
      this.obtenerImagenesByIdHotel(this.idHotel)
    }
  }

  obtenerImagenesByIdHotel(idHotel:number){
      this.imgHotelesService.getImagenesHoteles(idHotel).subscribe(imgHotel =>{
        this.imgHoteles = imgHotel
        console.log("Img" + this.imgHoteles)
      })
    
  }
}
