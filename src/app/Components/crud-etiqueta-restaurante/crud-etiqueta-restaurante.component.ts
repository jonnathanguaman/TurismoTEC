import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { EtiquetaRestaurante } from '../../Services/crud-etiqueta-restaurante/etiqueta-Restaurante';
import { EtiquetaRestauranteService } from '../../Services/crud-etiqueta-restaurante/etiqueta-Restaurante.service';
import { environment } from '../../../enviroments/enviroment';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-crud-etiqueta-restaurante',
  templateUrl: './crud-etiqueta-restaurante.component.html',
  styleUrl: './crud-etiqueta-restaurante.component.css'
})
export class CrudEtiquetaRestauranteComponent implements OnInit{
  isCrudModalOpen: boolean = false;
  etiquetas: EtiquetaRestaurante[]
  editar: boolean = false

  constructor(
    private fb: FormBuilder,
    private etiqueRestauranteService: EtiquetaRestauranteService,
    private activedRouter: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.obtenerEtiquetas()
  }

  obtenerEtiquetas() {
    this.etiqueRestauranteService.getEtiquetaRestaurante().subscribe(eti => {
      this.etiquetas = eti
    })
  }

  openCrudModal() {
    this.isCrudModalOpen = true;
  }

  closeCrudModal() {
    this.etiquetaForm.reset();
    this.isCrudModalOpen = false;
  }

  etiquetaForm = this.fb.group({
    idEtiqueta: [''],
    etiqueta: ['', [Validators.required]]
  })

  crearEtiqueta() {
    if (!this.editar) {
      if (this.etiquetaForm.valid) {
        this.etiqueRestauranteService.crearEtiquetaRestaurante(this.etiquetaForm.value as unknown as EtiquetaRestaurante).subscribe({
          next: () => {
            environment.mensajeToast('success', 'Etiqueta creada', 'Se ha creado la etiqueta con exito')
          },
          complete: () => {
            this.closeCrudModal()
            this.obtenerEtiquetas()
          },
          error: () => {
            environment.mensajeToast('error', 'Error al crear la etiqueta', 'Ocurrio un error')
          }
        })
      } else {
        environment.mensajeToast('warning', 'Ingresa todos los datos', 'Error al crear')
      }
    } else {
      if (this.etiquetaForm.valid) {
        this.etiqueRestauranteService.editarEtiquetaRestaurante(this.etiquetaForm.value as unknown as EtiquetaRestaurante).subscribe({
          next: () => {
            environment.mensajeToast('success', 'Etiqueta editada', 'Se ha editada la etiqueta con exito')
          },
          complete: () => {
            this.closeCrudModal()
            this.obtenerEtiquetas()
          },
          error: () => {
            environment.mensajeToast('error', 'Error al editada la etiqueta', 'Ocurrio un error')
          }
        })
      } else {
        environment.mensajeToast('warning', 'Ingresa todos los datos', 'Error al crear')
      }
    }
  }

  editarEtiqueta(id: number) {
    environment.mensajeEmergente('Editar', '¿Estas seguro que deseas editar la etiqueta?', 'warning').then((confirmado) => {
      if (confirmado) {
        this.isCrudModalOpen = true;
        this.editar = true
        this.etiqueRestauranteService.obtenerEtiquetaById(id).subscribe(etiqueta => {
          this.etiquetaForm.controls.etiqueta.setValue(etiqueta.etiqueta)
          this.etiquetaForm.controls.idEtiqueta.setValue(<string><unknown>etiqueta.idEtiquetaRestaurante)
        })
      }
    })
  }

  eliminarEtiqueta(idLugar: number) {
    const mensajeError = environment.mensajeEmergente('¿Estás seguro que deseas eliminar?', 'Esta operación no es reversible', 'warning');

    mensajeError.then((confirmado) => {
      if (confirmado) {
        this.etiqueRestauranteService.eliminarEtiquetaRestaurante(idLugar).subscribe({
          next: () => {
            this.obtenerEtiquetas();
            environment.mensajeToast('success', 'Eliminado con exito', 'Se ha eliminado con exito');
          },
        });
      }
    });
  }
}
