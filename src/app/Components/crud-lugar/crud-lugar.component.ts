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

    nuevoLugar() {
        return {
            id_lugar: null,
            nombre: '',
            descripcion: '',
            direccion: '',
            areaProtegida: false,
            patrimonio: false,
            rural: false,
            urbano: false,
            imagen: '',
        };
    }

    onSubmit() {
        if (this.lugar.id_lugar === null) {
            this.message = 'El ID Lugar es obligatorio.';
            return;
        }

        const existe = this.lugares.find((l) => l.id_lugar === this.lugar.id_lugar);
        if (existe) {
            this.message = 'El ID Lugar ya existe.';
        } else {
            this.lugares.push({ ...this.lugar });
            this.message = 'Lugar guardado exitosamente.';
        }

        this.limpiarFormulario();
    }

    limpiarFormulario() {
        this.lugar = this.nuevoLugar();
    }

    editarLugar(lugar: any) {
        this.lugar = { ...lugar };
    }

    eliminarLugar(id_lugar: number) {
        this.lugares = this.lugares.filter((l) => l.id_lugar !== id_lugar);
        this.message = 'Lugar eliminado correctamente.';
    }

    onImageChange(event: any) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e: any) => {
                this.lugar.imagen = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    }
}
