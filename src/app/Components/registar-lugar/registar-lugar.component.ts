import { Component, Input } from '@angular/core';
import { LugaresService } from '../../Services/Lugares/lugares.service';
import { FormBuilder, Validators } from '@angular/forms';
import { ImagenesLugaresService } from '../../Services/ImagenesLugares/imagenes-lugares.service';
import { CategoriaLugarService } from '../../Services/categoriasLugares/categoria-lugar.service';
import { LugaresCategoriasService } from '../../Services/lugares_Categorias/lugares-categorias.service';
import { Router } from 'express';
import { Lugares } from '../../Services/Lugares/lugares';
import { environment } from '../../../enviroments/enviroment';
import { AuthRegisterService } from '../../Services/auth/authRegister.service';
import { TokenPayload } from '../../Services/DatosPersonales/TokenPayload ';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-registar-lugar',
  templateUrl: './registar-lugar.component.html',
  styleUrl: './registar-lugar.component.css',
})
export class RegistarLugarComponent {
  @Input() longitud!: number;
  @Input() latitud!: number;

  imagePreviews: string[] = [];
  selectedFiles: File[] = [];

  auxlongitud!: number;
  auxlatitud!: number;

  ngOnChanges(): void {
    if (this.latitud !== undefined && this.longitud !== undefined) {
      this.lugaresForm.patchValue({
        latitud: this.latitud,
        longitud: this.longitud,
      });
      console.log(
        'Latitud y Longitud actualizadas:',
        this.latitud,
        this.longitud
      );
    }
  }
  constructor(
    private lugaresService: LugaresService,
    private fb: FormBuilder,
    private imagenesLugaresService: ImagenesLugaresService,
    private etiqueraLugarService: CategoriaLugarService,
    private lugarCategoriaService: LugaresCategoriasService,
    private authService: AuthRegisterService
  ) {}

  lugaresForm = this.fb.group({
    idLugares: [''],
    nombre: ['', [Validators.required]],
    descripcion: ['', [Validators.required]],
    direccion: ['', [Validators.required]],
    tipoZona: ['', [Validators.required]],
    areaProtegida: [''],
    patrimonio: [''],
    longitud: [{ value: null }, [Validators.required]],
    latitud: [{ value: null }, [Validators.required]],
    visualizacion:['', [Validators.required]],
    creadoPor:[false]
  });

  onFileSelected(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file) {
      this.selectedFiles[index] = file;

      const reader = new FileReader();

      reader.onload = (e: ProgressEvent<FileReader>) => {
        this.imagePreviews[index] = e.target?.result as string;
      };

      reader.readAsDataURL(file);
    } else {
      this.imagePreviews[index] = null;
    }
  }

  crearLugares() {
    const token = sessionStorage.getItem('token');
    const payload: TokenPayload = jwtDecode(token);
    this.authService.getIdPerson(payload.sub).subscribe({
      next: (idUser) => {
        if (this.lugaresForm.valid && this.imagePreviews.length >= 3) {
          this.lugaresService
            .guardarLugares(
              this.lugaresForm.value as unknown as Lugares,
              idUser
            )
            .subscribe({
              next: (lugarCreado: Lugares) => {
                const uploadPromises = this.selectedFiles.map((file) =>
                  this.imagenesLugaresService
                    .uploadImage(file, lugarCreado.idLugares)
                    .toPromise()
                );

                Promise.all(uploadPromises)
                  .then(() => {
                    environment.mensajeToast(
                      'success',
                      'Imágenes subidas',
                      'Todas las imágenes se subieron correctamente'
                    );
                    this.lugaresForm.reset();
                    this.selectedFiles = [];
                    this.imagePreviews = [];
                    this.volver();
                  })
                  .catch((error) => {
                    console.error('Error al subir las imágenes:', error);
                    environment.mensajeToast(
                      'error',
                      'Error al subir las imágenes',
                      'Ingrese todos los campos y seleccione las imágenes'
                    );
                  });
              },
              error: () => {
                environment.mensajeToast(
                  'error',
                  'Error al registrar',
                  'Ingrese todos los campos y seleccione las imágenes'
                );
              },
            });
        } else {
          environment.mensajeToast(
            'error',
            'Error al registrar',
            'Ingrese todos los campos y seleccione las imágenes else'
          );
        }
      },
    });
  }

  volver() {
    window.location.reload();
  }
}
