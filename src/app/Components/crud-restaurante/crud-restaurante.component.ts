import { Component } from '@angular/core';

@Component({
    selector: 'app-crud-restaurante',
    templateUrl: './crud-restaurante.component.html',
    styleUrls: ['./crud-restaurante.component.css'],
})
export class CrudRestauranteComponent {
    restaurante = this.nuevoRestaurante();
    restaurantes: any[] = [];
    message: string | null = null;

    nuevoRestaurante() {
        return {
            id_restaurante: null,
            nombre: '',
            direccion: '',
            telefono: '',
            descripcion: '',
            disponibilidad: 0,
            imagen: '',
        };
    }

    onSubmit() {
        if (this.restaurante.id_restaurante === null) {
            this.message = 'El ID Restaurante es obligatorio.';
            return;
        }

        const existe = this.restaurantes.find((r) => r.id_restaurante === this.restaurante.id_restaurante);
        if (existe) {
            this.message = 'El ID Restaurante ya existe.';
        } else {
            this.restaurantes.push({ ...this.restaurante });
            this.message = 'Restaurante guardado exitosamente.';
        }

        this.limpiarFormulario();
    }

    limpiarFormulario() {
        this.restaurante = this.nuevoRestaurante();
    }

    editarRestaurante(restaurante: any) {
        this.restaurante = { ...restaurante };
    }

    eliminarRestaurante(id_restaurante: number) {
        this.restaurantes = this.restaurantes.filter((r) => r.id_restaurante !== id_restaurante);
        this.message = 'Restaurante eliminado correctamente.';
    }

    onImageChange(event: any) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e: any) => {
                this.restaurante.imagen = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    }
}
