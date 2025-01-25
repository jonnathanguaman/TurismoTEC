import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { EtiquetasLugar } from '../../Services/categoriasLugares/categoriaLugar';
import { CategoriaLugarService } from '../../Services/categoriasLugares/categoria-lugar.service';
import { environment } from '../../../enviroments/enviroment';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-crub-etiqueta-lugar',
  templateUrl: './crub-etiqueta-lugar.component.html',
  styleUrl: './crub-etiqueta-lugar.component.css'
})
export class CrubEtiquetaLugarComponent implements OnInit{
  isCrudModalOpen: boolean = false;
  etiquetas:EtiquetasLugar[]
  editar:boolean = false

  constructor(
    private fb: FormBuilder,
    private categoriaLugarService:CategoriaLugarService,
    private activedRouter:ActivatedRoute,
  ){}
  ngOnInit(): void {
    this.obtenerEtiquetas()
  }

  obtenerEtiquetas(){
    this.categoriaLugarService.getTodosLugares().subscribe(cat=>{
      this.etiquetas = cat
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
    idEtiqueta:[''],
    etiqueta:['',[Validators.required]]
  })

  crearEtiqueta(){
    if(!this.editar){
      if(this.etiquetaForm.valid){
        this.categoriaLugarService.crearEtiquetaLugar(this.etiquetaForm.value as unknown as EtiquetasLugar).subscribe({
          next:()=>{
            environment.mensajeToast('success','Etiqueta creada','Se ha creado la etiqueta con exito')
          },
          complete:()=>{
            this.closeCrudModal()
            this.obtenerEtiquetas()
          },
          error:()=>{
            environment.mensajeToast('error','Error al crear la etiqueta','Ocurrio un error')
          }
        })
      }else{
        environment.mensajeToast('warning','Ingresa todos los datos','Error al crear')
      }
    }else{
      if(this.etiquetaForm.valid){
        this.categoriaLugarService.editarEtiquetaLugar(this.etiquetaForm.value as unknown as EtiquetasLugar).subscribe({
          next:()=>{
            environment.mensajeToast('success','Etiqueta editada','Se ha editada la etiqueta con exito')
          },
          complete:()=>{
            this.closeCrudModal()
            this.obtenerEtiquetas()
          },
          error:()=>{
            environment.mensajeToast('error','Error al editada la etiqueta','Ocurrio un error')
          }
        })
      }else{
        environment.mensajeToast('warning','Ingresa todos los datos','Error al crear')
      }
    }
  }

  editarEtiqueta(id:number){
        environment.mensajeEmergente('Editar','¿Estas seguro que deseas editar la etiqueta?','warning').then((confirmado)=>{
          if(confirmado){
            this.isCrudModalOpen = true;
            this.editar = true
            this.categoriaLugarService.obtenerEtiquetaById(id).subscribe(etiqueta=>{
            this.etiquetaForm.controls.etiqueta.setValue(etiqueta.etiqueta)
            this.etiquetaForm.controls.idEtiqueta.setValue(<string> <unknown> etiqueta.idEtiqueta)
          })
          }
    })
  }

  eliminarEtiqueta(idLugar: number) {
    const mensajeError = environment.mensajeEmergente('¿Estás seguro que deseas eliminar?','Esta operación no es reversible','warning');

    mensajeError.then((confirmado) => {
      if (confirmado) {
        this.categoriaLugarService.eliminarEtiquetaLugar(idLugar).subscribe({
          next: () => {
            this.obtenerEtiquetas();
            environment.mensajeToast('success','Eliminado con exito','Se ha eliminado con exito');
          },
        });
      }
    });
  }
}
