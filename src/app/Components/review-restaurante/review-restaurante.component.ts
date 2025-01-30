import { Component, Input } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthRegisterService } from '../../Services/auth/authRegister.service';
import { ReviewRestaurante } from '../../Services/review-restaurantes/reviewRestaurante';
import { ReviewRestauranteService } from '../../Services/review-restaurantes/review-restaurante.service';
import { TokenPayload } from '../../Services/DatosPersonales/TokenPayload ';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../../../enviroments/enviroment';

@Component({
  selector: 'app-review-restaurante',
  templateUrl: './review-restaurante.component.html',
  styleUrl: './review-restaurante.component.css'
})
export class ReviewRestauranteComponent {

  @Input() idRestaurante?:number
  
    constructor(
      private reviewRestaurantesService:ReviewRestauranteService,
      private fb:FormBuilder,
      private authService: AuthRegisterService,
    ){}
    isModalOpen = false;
    rating: number = 0;
    stars: number[] = [1, 2, 3, 4, 5];
  
    openModal(): void {
      this.isModalOpen = true;
    }
  
    closeModal(): void {
      this.isModalOpen = false;
    }
  
    rate(star: number): void {
      this.rating = star;
    }
  
    ngOnInit(): void {
      this.obtenerReseña()
    }
  
    todasreviewRestaurantes:ReviewRestaurante[]
  
    obtenerReseña(){
      this.reviewRestaurantesService.obtenerReviewByIdRestaurante(this.idRestaurante).subscribe({
        next:(hoteles)=>{
          this.todasreviewRestaurantes = hoteles
        }
      })
    }
  
    reviewForm = this.fb.group({
      contenido:['',[Validators.required]],
      calificacion:[0,[Validators.required]]
    })
  
    crearReviewHotel(){
      const token = sessionStorage.getItem("token")
      if(token){
      const payload: TokenPayload = jwtDecode(token);
        this.authService.getIdPerson(payload.sub).subscribe({
          next: (idUser) => {
            this.reviewForm.controls.calificacion.setValue(this.rating)
            this.reviewRestaurantesService.crearReviewRestaurante(this.reviewForm.value as unknown as ReviewRestaurante,idUser,this.idRestaurante).subscribe({
              next:()=>{
                environment.mensajeToast('success','Reseña publicada','Gracias con compartir tu experiencia')
              },
              complete:()=>{
                this.obtenerReseña()
                this.closeModal()
              }
            })
          }})
        }else{
          environment.mensajeToast('warning','Error al crear la reseña','Por favor inicie sesión')
        }
      }
}
