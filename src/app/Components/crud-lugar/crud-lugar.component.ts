import { Component, OnInit } from '@angular/core';
import { LugaresService } from '../../Services/Lugares/lugares.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Lugares } from '../../Services/Lugares/lugares';
import { environment } from '../../../enviroments/enviroment';

@Component({
    selector: 'app-crud-lugar',
    templateUrl: './crud-lugar.component.html',
    styleUrls: ['./crud-lugar.component.css'],
})
export class CrudLugarComponent implements OnInit{
    
    isCrudModalOpen: boolean = false;


    openCrudModal() {
        this.isCrudModalOpen = true;
    }

    closeCrudModal() {
        this.isCrudModalOpen = false;
    }

    constructor(private lugaresService:LugaresService,
        private fb: FormBuilder,
    ){}

    ngOnInit(): void {
        this.obtenerLugares()
    }

    lugaresForm = this.fb.group({
        nombre:['',[Validators.required]],
        descripcion:['',[Validators.required]],
        direccion:['',[Validators.required]],
        tipoZona:['',[Validators.required]],
        areaProtegida:['',[Validators.required]],
        patrimonio:['',[Validators.required]]
    })

    todosLugares!:Lugares[]

    crearLugares(){
        console.log(this.lugaresForm.value)
        if(this.lugaresForm.valid){
            console.log("Entro a crear")
            this.lugaresService.guardarLugares(this.lugaresForm.value as unknown as Lugares).subscribe({
                next:()=>{
                    environment.mensajeToast('success','Lugar creado','El lugar se creo con exito')
                    this.obtenerLugares()
                    this.closeCrudModal()
                    this.lugaresForm.reset()
                },
                error:()=>{
                    environment.mensajeToast('error','Lo sentimos algo salio mal','Hemos notificado el error')
                }
            })
        }
        environment.mensajeToast('error','Error al registrar','Ingrese todos los campos')
    }

    obtenerLugares(){
        this.lugaresService.getTodosLugares().subscribe(lugares=>{
            this.todosLugares = lugares
        })
    }

    eliminarLugar(idLugar:number){
        const mensajeError = environment.mensajeEliminar('¿Estás seguro que deseas eliminar?','Esta operación no es reversible','warning');
        
          mensajeError.then((confirmado) => {
            if (confirmado) {
             this.lugaresService.eliminarLugar(idLugar).subscribe({
                next:()=>{
                this.obtenerLugares()
                environment.mensajeToast('success','Eliminado con exito','Se ha eliminado con exito')
                }
             })
            }
          });
    }
}
