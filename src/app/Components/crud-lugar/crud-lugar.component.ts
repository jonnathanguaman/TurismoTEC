import { Component } from '@angular/core';

@Component({
    selector: 'app-crud-lugar',
    templateUrl: './crud-lugar.component.html',
    styleUrls: ['./crud-lugar.component.css'],
})
export class CrudLugarComponent {
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
}
