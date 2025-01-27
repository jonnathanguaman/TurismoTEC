import { Component } from '@angular/core';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.css'],
})
export class ReviewComponent {
  isModalOpen = false;
  reviewContent: string = '';
  currentDate: string = '';
  rating: number = 0;
  stars: number[] = [1, 2, 3, 4, 5];
  reviews: { content: string; date: string; stars: number }[] = [];

  // Abrir el modal
  openModal(): void {
    this.isModalOpen = true;
    this.currentDate = new Date().toLocaleString(); // Generar la fecha y hora actual
  }

  // Cerrar el modal
  closeModal(): void {
    this.isModalOpen = false;
  }

  // Calificar con estrellas
  rate(star: number): void {
    this.rating = star;
  }

  // Enviar la reseña
  submitReview(): void {
    if (this.reviewContent.trim() && this.rating > 0) {
      this.reviews.push({
        content: this.reviewContent,
        date: this.currentDate,
        stars: this.rating,
      });
      this.reviewContent = '';
      this.rating = 0;
      this.closeModal();
    } else {
      alert('Por favor, completa todos los campos y selecciona una calificación.');
    }
  }
}