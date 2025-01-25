import { Component, OnInit } from '@angular/core';
import { LugaresService } from '../../Services/Lugares/lugares.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Lugares } from '../../Services/Lugares/lugares';
import { environment } from '../../../enviroments/enviroment';
import { ImagenesLugaresService } from '../../Services/ImagenesLugares/imagenes-lugares.service';

@Component({
  selector: 'app-crud-lugar',
  templateUrl: './crud-lugar.component.html',
  styleUrls: ['./crud-lugar.component.css'],
})
export class CrudLugarComponent implements OnInit {
  isCrudModalOpen: boolean = false;
  imagePreviews: string[] = [null, null, null];
  selectedFiles: File[] = [null, null, null];

  openCrudModal() {
    this.isCrudModalOpen = true;
  }

  closeCrudModal() {
    this.lugaresForm.reset();
    this.isCrudModalOpen = false;
  }

  constructor(
    private lugaresService: LugaresService,
    private fb: FormBuilder,
    private imagenesLugaresService: ImagenesLugaresService
  ) {}

  ngOnInit(): void {
    this.obtenerLugares();
  }

  lugaresForm = this.fb.group({
    nombre: ['', [Validators.required]],
    descripcion: ['', [Validators.required]],
    direccion: ['', [Validators.required]],
    tipoZona: ['', [Validators.required]],
    areaProtegida: [''],
    patrimonio: [''],
    longitud: ['', [Validators.required]],
    latitud: ['', [Validators.required]],
  });

  todosLugares!: Lugares[];

  crearLugares() {
    if (this.lugaresForm.valid && this.imagePreviews.length == 3) {
      console.log('Entro a crear');
      this.lugaresService
        .guardarLugares(this.lugaresForm.value as unknown as Lugares)
        .subscribe({
          next: (lugarCreado: Lugares) => {
            const uploadPromises = this.selectedFiles.map((file) =>
              this.imagenesLugaresService.uploadImage(file, lugarCreado.idLugares).toPromise());

            Promise.all(uploadPromises)
              .then(() => {
                environment.mensajeToast('success','Imágenes subidas','Todas las imágenes se subieron correctamente');
                this.obtenerLugares();
                this.closeCrudModal();
                this.lugaresForm.reset();
                this.selectedFiles = [null, null, null];
                this.imagePreviews = [null, null, null];
              })
              .catch((error) => {
                console.error('Error al subir las imágenes:', error);
                environment.mensajeToast(
                  'error',
                  'Error al subir las imágenes',
                  'Hemos notificado el error'
                );
              });
          },
          error: () => {
            environment.mensajeToast(
              'error',
              'Error al registrar',
              'Hemos notificado el error'
            );
          },
        });
    } else {
      environment.mensajeToast(
        'error','Error al registrar','Ingrese todos los campos y seleccione las imágenes');
    }
  }

  obtenerLugares() {
    this.lugaresService.getTodosLugares().subscribe((lugares) => {
      this.todosLugares = lugares;
    });
  }

  eliminarLugar(idLugar: number) {
    const mensajeError = environment.mensajeEmergente(
      '¿Estás seguro que deseas eliminar?',
      'Esta operación no es reversible',
      'warning'
    );

    mensajeError.then((confirmado) => {
      if (confirmado) {
        this.lugaresService.eliminarLugar(idLugar).subscribe({
          next: () => {
            this.obtenerLugares();
            environment.mensajeToast(
              'success',
              'Eliminado con exito',
              'Se ha eliminado con exito'
            );
          },
        });
      }
    });
  }

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
}
