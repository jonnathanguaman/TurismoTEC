import { Component } from '@angular/core';

@Component({
    selector: 'app-crud-hotel',
    templateUrl: './crud-hotel.component.html',
    styleUrls: ['./crud-hotel.component.css'],
})
export class CrudHotelComponent {
    hotel = this.nuevoHotel();
    hoteles: any[] = [];
    message: string | null = null;
    isCrudModalOpen: boolean = false;

    nuevoHotel() {
        return {
            id_hotel: "null",
            nombre: '',
            direccion: '',
            telefono: '',
            descripcion: '',
            precio: "null",
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
        const existe = this.hoteles.find((h) => h.id_hotel === this.hotel.id_hotel);
        if (existe) {
            const index = this.hoteles.findIndex((h) => h.id_hotel === this.hotel.id_hotel);
            this.hoteles[index] = { ...this.hotel };
            this.message = 'Hotel actualizado exitosamente.';
        } else {
            this.hoteles.push({ ...this.hotel });
            this.message = 'Hotel guardado exitosamente.';
        }
        this.closeCrudModal();
        this.limpiarFormulario();
    }

    limpiarFormulario() {
        this.hotel = this.nuevoHotel();
    }

    editarHotel(hotel: any) {
        this.hotel = { ...hotel };
        this.openCrudModal();
    }

    eliminarHotel(id_hotel: number) {
        this.hoteles = this.hoteles.filter((hotel) => hotel.id_hotel !== id_hotel);
        this.message = 'Hotel eliminado exitosamente.';
    }

    onImageChange(event: any) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => (this.hotel.imagen = reader.result as string);
            reader.readAsDataURL(file);
        }
    }
}
