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
    isCrudModalOpen: boolean = false;

    nuevoRestaurante() {
        return {
            id_restaurante: null,
            nombre: '',
            direccion: '',
            telefono: '',
            descripcion: '',
            precio: null,
            disponibilidad: false,
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
        const existe = this.restaurantes.find((r) => r.id_restaurante === this.restaurante.id_restaurante);
        if (existe) {
            const index = this.restaurantes.findIndex((r) => r.id_restaurante === this.restaurante.id_restaurante);
            this.restaurantes[index] = { ...this.restaurante };
            this.message = 'Restaurante actualizado exitosamente.';
        } else {
            this.restaurantes.push({ ...this.restaurante });
            this.message = 'Restaurante guardado exitosamente.';
        }
        this.closeCrudModal();
        this.limpiarFormulario();
    }

    limpiarFormulario() {
        this.restaurante = this.nuevoRestaurante();
    }

    editarRestaurante(restaurante: any) {
        this.restaurante = { ...restaurante };
        this.openCrudModal();
    }

    eliminarRestaurante(id_restaurante: number) {
        this.restaurantes = this.restaurantes.filter((restaurante) => restaurante.id_restaurante !== id_restaurante);
        this.message = 'Restaurante eliminado exitosamente.';
    }

    onImageChange(event: any) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => (this.restaurante.imagen = reader.result as string);
            reader.readAsDataURL(file);
        }
    }
}
