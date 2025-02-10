import { Component, Input } from '@angular/core';
import { ReviewLugaresService } from '../../Services/review-lugares/review-lugares.service';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthRegisterService } from '../../Services/auth/authRegister.service';
import { ReviewLugar } from '../../Services/review-lugares/reviewLugares';
import { TokenPayload } from '../../Services/DatosPersonales/TokenPayload ';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../../../enviroments/enviroment';
import { ReviewHotelesService } from '../../Services/review-hoteles/review-hoteles.service';
import { ReviewHoteles } from '../../Services/review-hoteles/review-hoteles';

@Component({
  selector: 'app-review-hotel',
  templateUrl: './review-hotel.component.html',
  styleUrl: './review-hotel.component.css'
})
export class ReviewHotelComponent {
  @Input() idHotel?: number;

  constructor(
    private reviewHotelesService: ReviewHotelesService,
    private fb: FormBuilder,
    private authService: AuthRegisterService
  ) {}

  isModalOpen = false;
  rating: number = 0;
  stars: number[] = [1, 2, 3, 4, 5];

  todasreviewHoteles: ReviewHoteles[];

  reviewForm = this.fb.group({
    contenido: ['', [Validators.required]],
    calificacion: [0, [Validators.required]]
  });

  openModal(): void {
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.resetForm();
  }

  rate(star: number): void {
    this.rating = star;
  }

  obtenerReseña(): void {
    this.reviewHotelesService.obtenerReviewByIdHotel(this.idHotel).subscribe({
      next: (hoteles) => {
        this.todasreviewHoteles = hoteles;
      }
    });
  }

  resetForm(): void {
    this.reviewForm.reset();
    this.reviewForm.controls['calificacion'].setValue(0);
    this.rating = 0;
  }

  crearReviewHotel(): void {
    const token = sessionStorage.getItem("token");
    if (token) {
      const payload: TokenPayload = jwtDecode(token);
      this.authService.getIdPerson(payload.sub).subscribe({
        next: (idUser) => {
          this.reviewForm.controls.calificacion.setValue(this.rating);
          this.reviewHotelesService.crearReviewHotel(this.reviewForm.value as unknown as ReviewHoteles, idUser, this.idHotel).subscribe({
            next: () => {
              environment.mensajeToast('success', 'Reseña publicada', 'Gracias por compartir tu experiencia');
            },
            complete: () => {
              this.obtenerReseña();
              this.resetForm();
              this.closeModal();
            }
          });
        }
      });
    } else {
      environment.mensajeToast('warning', 'Error al crear la reseña', 'Por favor inicie sesión');
    }
  }
}
