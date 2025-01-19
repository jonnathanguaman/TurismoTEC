import { Component } from '@angular/core';

@Component({
  selector: 'app-foro',
  templateUrl: './foro.component.html',
  styleUrls: ['./foro.component.css'],
})
export class ForoComponent {
  mostrarVentana: boolean = false;
  mostrarVentanaCrear: boolean = false;

  nuevoTitulo: string = '';
  nuevoContenido: string = '';
  nuevoComentario: string[] = [];

  publicaciones: any[] = [];

  abrirVentana() {
    this.mostrarVentana = true;
  }

  cerrarVentana() {
    this.mostrarVentana = false;
    this.mostrarVentanaCrear = false;
  }

  abrirVentanaCrear() {
    this.mostrarVentana = false;
    this.mostrarVentanaCrear = true;
  }

  publicar() {
    if (this.nuevoTitulo.trim() && this.nuevoContenido.trim()) {
      this.publicaciones.push({
        titulo: this.nuevoTitulo,
        contenido: this.nuevoContenido,
        comentarios: [],
      });
      this.nuevoTitulo = '';
      this.nuevoContenido = '';
      this.cerrarVentana();
    } else {
      alert('Por favor, completa todos los campos antes de publicar.');
    }
  }

  agregarComentario(publicacion: any, index: number) {
    if (this.nuevoComentario[index]?.trim()) {
      publicacion.comentarios.push(this.nuevoComentario[index]);
      this.nuevoComentario[index] = '';
    } else {
      alert('El comentario no puede estar vacío.');
    }
  }

  autoResize(event: any) {
    event.target.style.height = 'auto';
    event.target.style.height = `${event.target.scrollHeight}px`;
  }
}
