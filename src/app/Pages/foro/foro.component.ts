import { Component, OnInit } from '@angular/core';
import { PublicacionesService } from '../../Services/publicaciones/publicaciones.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Publicaciones } from '../../Services/publicaciones/publicaciones';
import Swal from 'sweetalert2';

const Toast = Swal.mixin({
  toast: true,
  position: 'bottom-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  showCloseButton: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  },
});

@Component({
  selector: 'app-foro',
  templateUrl: './foro.component.html',
  styleUrl: './foro.component.css',
})
export class ForoComponent implements OnInit {
  mostrarVentana: boolean = false;
  mostrarVentanaCrear: boolean = false;

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

  mostrarComentarios: boolean = false;
  mostrandoFormulario: boolean = false;

  textComentario: string = '▼ Comentarios';

  verComentarios() {
    this.mostrarComentarios = !this.mostrarComentarios;
    if (this.mostrarComentarios) {
      this.textComentario = '▲ Comentarios';
    } else {
      this.textComentario = '▼ Comentarios';
    }
  }

  comentar() {
    this.mostrandoFormulario = true;
  }

  publicacionesList!: Publicaciones[];

  constructor(
    private publicacionesService: PublicacionesService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.obtenerPublicaciones();
  }

  publicacionForm = this.fb.group({
    idPublicaciones: ['', [Validators.required]],
    titulo: ['', [Validators.required]],
    contenido: ['', [Validators.required]],
    idusuario: [, [Validators.required]],
  });

  get titulo() {
    return this.publicacionForm.controls.titulo;
  }

  get contenido() {
    return this.publicacionForm.controls.contenido;
  }

  get usuario() {
    return this.publicacionForm.controls.idusuario;
  }

  guardarPublicacion() {
    if (this.publicacionForm) {
      this.publicacionesService
        .guardarPublicacion(
          this.publicacionForm.value as unknown as Publicaciones,
          <number>(<unknown>sessionStorage.getItem('id'))
        )
        .subscribe({
          next: () => {
            this.obtenerPublicaciones();
            this.cerrarVentana();
            Toast.fire({
              icon: 'success',
              title: 'Se ha publicado con exito',
              footer: 'Gracias por compartir con la comunidad',
            });
          },
          error: (e) => {
            console.log(e);
          },
        });
    }
  }

  obtenerPublicaciones() {
    this.publicacionesService.getPublicaciones().subscribe((publicaciones) => {
      this.publicacionesList = publicaciones;
    });
  }

  autoResize(event: any) {
    event.target.style.height = 'auto';
    event.target.style.height = `${event.target.scrollHeight}px`;
  }
}
