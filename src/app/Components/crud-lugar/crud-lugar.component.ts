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
    lugar = this.nuevoLugar();
    lugares: any[] = [];
    message: string | null = null;
    isCrudModalOpen: boolean = false;

    nuevoLugar() {
        return {
            id_lugar: null,
            nombre: '',
            direccion: '',
            descripcion: '',
            areaProtegida: false,
            patrimonio: false,
            urbano: false,
            rural: false,
            imagen: '',
        };
    }

    openCrudModal() {
        this.isCrudModalOpen = true;
    }

    closeCrudModal() {
        this.isCrudModalOpen = false;
    }

    onSubmit() {
        if (this.lugar.id_lugar) {
            const index = this.lugares.findIndex(l => l.id_lugar === this.lugar.id_lugar);
            if (index !== -1) {
                this.lugares[index] = { ...this.lugar };
            }
        } else {
           // this.lugar.id_lugar = this.lugares.length + 1;
            this.lugares.push({ ...this.lugar });
        }

        this.message = 'Lugar guardado correctamente!';
        this.lugar = this.nuevoLugar();
        this.isCrudModalOpen = false;
    }

    limpiarFormulario() {
        this.lugar = this.nuevoLugar();
    }

    eliminarLugar(id: number) {
        this.lugares = this.lugares.filter(l => l.id_lugar !== id);
        this.message = 'Lugar eliminado correctamente!';
    }

    editarLugar(lugar: any) {
        this.lugar = { ...lugar };
        this.isCrudModalOpen = true;
    }

    onImageChange(event: any) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                this.lugar.imagen = reader.result as string;
            };
        }
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
        if(!this.lugaresForm.valid){
            console.log("Entro a crear")
            this.lugaresService.guardarLugares(this.lugaresForm.value as unknown as Lugares).subscribe({
                next:()=>{
                    environment.mensajeToast('success','Lugar creado','El lugar se creo con exito')
                },
                error:()=>{
                    environment.mensajeToast('error','Error al registrar','Ingrese todos los campos')
                }
            })
        }
        console.log("No entro")
    }

    obtenerLugares(){
        this.lugaresService.getTodosLugares().subscribe(lugares=>{
            this.todosLugares = lugares
        })
    }
}
