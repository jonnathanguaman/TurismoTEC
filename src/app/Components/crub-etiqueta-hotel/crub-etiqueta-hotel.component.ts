import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { EtiquetaHotel } from '../../Services/crub-etiqueta-hotel/etiqueta-hotel';
import { EtiquetaHotelService } from '../../Services/crub-etiqueta-hotel/etiqueta-hotel.service';
import { environment } from '../../../enviroments/enviroment';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-crub-etiqueta-hotel',
  templateUrl: './crub-etiqueta-hotel.component.html',
  styleUrl: './crub-etiqueta-hotel.component.css'
})
export class CrubEtiquetaHotelComponent implements OnInit {
  isCrudModalOpen: boolean = false;
  etiquetas: EtiquetaHotel[]
  editar: boolean = false

  constructor(
    private fb: FormBuilder,
    private etiquetaHotelService: EtiquetaHotelService,
    private activedRouter: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.obtenerEtiquetas()
  }

  obtenerEtiquetas() {
    this.etiquetaHotelService.getEtiquetaHotel().subscribe(eti => {
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
    idEtiquetaHoteles: [''],
    etiqueta: ['', [Validators.required]]
  })

  crearEtiqueta() {
    if (!this.editar) {
      if (this.etiquetaForm.valid) {
        this.etiquetaHotelService.crearEtiquetaHotel(this.etiquetaForm.value as unknown as EtiquetaHotel).subscribe({
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
        this.etiquetaHotelService.editarEtiquetaHotel(this.etiquetaForm.value as unknown as EtiquetaHotel).subscribe({
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
        this.etiquetaHotelService.obtenerEtiquetaById(id).subscribe(etiqueta => {
          this.etiquetaForm.controls.etiqueta.setValue(etiqueta.etiqueta)
          this.etiquetaForm.controls.idEtiquetaHoteles.setValue(<string><unknown>etiqueta.idEtiquetaHoteles)
        })
      }
    })
  }

  eliminarEtiqueta(idLugar: number) {
    const mensajeError = environment.mensajeEmergente('¿Estás seguro que deseas eliminar?','Esta operación no es reversible','warning');

    mensajeError.then((confirmado) => {
      if (confirmado) {
        this.etiquetaHotelService.eliminarEtiquetaHotel(idLugar).subscribe({
          next: () => {
            this.obtenerEtiquetas();
            environment.mensajeToast('success','Eliminado con exito','Se ha eliminado con exito');
          },
        });
      }
    });
  }
}
