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

    nuevoHotel() {
        return {
            id_hotel: null,
            nombre: '',
            direccion: '',
            telefono: '',
            descripcion: '',
            precio: null,
            disponibilidad: false,
            imagen: '',
        };
    }

    onSubmit() {
        if (this.hotel.id_hotel === null) {
            this.message = 'El ID del hotel es obligatorio.';
            return;
        }

        const existe = this.hoteles.find((h) => h.id_hotel === this.hotel.id_hotel);
        if (existe) {
            this.message = 'El ID del hotel ya existe.';
        } else {
            this.hoteles.push({ ...this.hotel });
            this.message = 'Hotel guardado exitosamente.';
        }

        this.limpiarFormulario();
    }

    limpiarFormulario() {
        this.hotel = this.nuevoHotel();
    }

    editarHotel(hotel: any) {
        this.hotel = { ...hotel };
    }

    eliminarHotel(id_hotel: number) {
        this.hoteles = this.hoteles.filter((h) => h.id_hotel !== id_hotel);
        this.message = 'Hotel eliminado correctamente.';
    }

    onImageChange(event: any) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e: any) => {
                this.hotel.imagen = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    }
}
  

