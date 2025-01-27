import { Component, OnInit } from '@angular/core';
import { PublicacionesService } from '../../Services/publicaciones/publicaciones.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Publicaciones } from '../../Services/publicaciones/publicaciones';
import Swal from 'sweetalert2';
import { ComentarioService } from '../../Services/comentario/comentario.service';
import { Comentario } from '../../Services/comentario/comentario';
import { AuthRegisterService } from '../../Services/auth/authRegister.service';
import { TokenPayload } from '../../Services/DatosPersonales/TokenPayload ';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../../../enviroments/enviroment';

type ToastIcon = 'success' | 'error' | 'warning' | 'info' | 'question';

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

  idPublicacionHaComentar!: number;

  mostrarComentarios: boolean = false;
  mostrandoFormulario: boolean = false;

  publicacionesList!: Publicaciones[];
  comentariosList!: Comentario[];

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

  verComentarios(publicacion: Publicaciones) {
    if (!publicacion.mostrarComentarios) {
      this.comentarioService.obtenerComentarioDePublicacion(publicacion.idPublicaciones).subscribe((comentarios) => {
        publicacion.comentarios = comentarios; 
        publicacion.mostrarComentarios = true;
        publicacion.textComentario = '▲ Comentarios';
      });
    } else {
      publicacion.mostrarComentarios = false;
        publicacion.textComentario = '▼ Comentarios';
    }
  }
  

  comentar(publicacion: Publicaciones) {
    this.idPublicacionHaComentar = publicacion.idPublicaciones;
    publicacion.mostrandoFormulario = !publicacion.mostrandoFormulario
  }

  cancelarComentar(publicacion: Publicaciones) {
    publicacion.mostrandoFormulario = !publicacion.mostrandoFormulario
  }

  constructor(
    private publicacionesService: PublicacionesService,
    private fb: FormBuilder,
    private comentarioService: ComentarioService,
    private authService: AuthRegisterService,
  ) {}

  ngOnInit(): void {
    this.obtenerPublicaciones();
  }

  publicacionForm = this.fb.group({
    idPublicaciones: ['', [Validators.required]],
    titulo: ['', [Validators.required]],
    contenido: ['', [Validators.required]],
  });

  comentarioForm = this.fb.group({
    contenido: ['', [Validators.required]],
  });

  get titulo() {
    return this.publicacionForm.controls.titulo;
  }

  get contenido() {
    return this.publicacionForm.controls.contenido;
  }

  get contenidoComentario() {
    return this.comentarioForm.controls.contenido;
  }

  limpiarCamposPublicacion(){
    this.publicacionForm.controls.titulo.setValue('')
    this.publicacionForm.controls.contenido.setValue('')
  }

  limpiarCamposComentario(){
    this.comentarioForm.controls.contenido.setValue('')
  }
  
  guardarPublicacion() {
    const token = sessionStorage.getItem('token');
    if(token){
      const payload: TokenPayload = jwtDecode(token); 
      this.authService.getIdPerson(payload.sub).subscribe({
        next:(idPersona)=>{
          if (this.publicacionForm) {
            this.publicacionesService
              .guardarPublicacion(this.publicacionForm.value as unknown as Publicaciones,idPersona)
              .subscribe({
                next: () => {
                  this.limpiarCamposPublicacion()
                  this.obtenerPublicaciones();
                  this.cerrarVentana();
                  this.mensajeToast('success','Publicacion registrada','Gracias por compartir con la comunidad');
                },
                error: (e) => {
                  console.log(e);
                },
              });
          }
        }
      }
      )
    }
    else{
      environment.mensajeToast('warning','No se pudo guargar la publicacion','Por favor registrese o inicie sesión')
    }
  }

  obtenerPublicaciones() {
    this.publicacionesService.getPublicaciones().subscribe((publicaciones) => {
      this.publicacionesList = publicaciones.map((publicacion) => ({
        ...publicacion, // Copia todas las propiedades existentes de `publicacion`
        textComentario: '▼ Comentarios',
        mostrarComentarios: false, 
      }));;
    });
  }

  guardarComentario() {
    const token = sessionStorage.getItem('token');

    if(token){
      const payload: TokenPayload = jwtDecode(token); 
      this.authService.getIdPerson(payload.sub).subscribe({
        next:(idPersona)=>{
          this.comentarioService.guardarComentario(this.comentarioForm.value as Comentario,idPersona,this.idPublicacionHaComentar).subscribe({
            next:()=>{
              this.limpiarCamposComentario()
              this.mensajeToast('success','Comentario registrado','Gracias por compartir con la comunidad');
            }
          });
        }
      }
      )
    }else{
      environment.mensajeToast('warning','No se pudo guargar la publicacion','Por favor registrese o inicie sesión')
    }

    
  }

  autoResize(event: any) {
    event.target.style.height = 'auto';
    event.target.style.height = `${event.target.scrollHeight}px`;
  }


  mensajeToast(tipo: ToastIcon, mesajeCuerpo: string, footer: string) {
    Toast.fire({
      icon: tipo,
      title: mesajeCuerpo,
      footer: footer
    });
  }
  
}
