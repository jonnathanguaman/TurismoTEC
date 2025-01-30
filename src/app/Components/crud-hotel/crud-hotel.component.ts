import { Component, OnInit } from '@angular/core';
import { HotelesService } from '../../Services/hoteles/hoteles.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Hoteles } from '../../Services/hoteles/hoteles';
import { environment } from '../../../enviroments/enviroment';
import { ImagenesHotelesService } from '../../Services/imagenesHoteles/imagenes-hoteles.service';
import { EtiquetaHotel } from '../../Services/crub-etiqueta-hotel/etiqueta-hotel';
import { EtiquetaHotelService } from '../../Services/crub-etiqueta-hotel/etiqueta-hotel.service';
import { AuthRegisterService } from '../../Services/auth/authRegister.service';

@Component({
    selector: 'app-crud-hotel',
    templateUrl: './crud-hotel.component.html',
    styleUrls: ['./crud-hotel.component.css'],
})
export class CrudHotelComponent implements OnInit {

    isCrudModalOpen: boolean = false;
    imagePreviews: string[] = [];
    selectedFiles: File[] = [];
    etiquetas!: EtiquetaHotel[];
    modalEtiqueta: boolean = false;
    todosHoteles!: Hoteles[];
    idHotel: number;
    etiquetasDelHotel: EtiquetaHotel[];
    urlHost: string = environment.urlHost;
    public hotelEtiqueta = new EtiquetaHotel();

    abrirModalEtiqueta() {
        this.obtenerEtiquetas();
        this.modalEtiqueta = true;
    }

    cerrarModalEtiqueta() {
        this.modalEtiqueta = false;
    }

    openCrudModal() {
        this.isCrudModalOpen = true;
    }

    closeCrudModal() {
        this.hotelForm.reset();
        this.isCrudModalOpen = false;
        this.selectedFiles = [];
        this.imagePreviews = [];
    }

    guardarIdHotel(idHotel: number) {
        this.idHotel = idHotel;
    }

    constructor(
        private hotelesService: HotelesService,
        private fb: FormBuilder,
        private imagenesHotelesService: ImagenesHotelesService,
        private etiquetaHotelService: EtiquetaHotelService,
        private authService: AuthRegisterService
    ) { }

    ngOnInit(): void {
        this.obtenerHoteles();
    }

    hotelForm = this.fb.group({
        idHotel: [''],
        nombre: ['', [Validators.required]],
        direccion: ['', [Validators.required]],
        telefono: ['', [Validators.required]],
        descripcion: ['', [Validators.required]],
        calificacion: ['', [Validators.required]]
    });

    crearHotel() {

    }

    eliminarHotel(idHotel: number) {
        const mensajeError = environment.mensajeEmergente(
            '¿Estás seguro que deseas eliminar?',
            'Esta operación no es reversible',
            'warning'
        );
        mensajeError.then((confirmado) => {
            if (confirmado) {
                this.hotelesService.eliminarHotel(idHotel).subscribe({
                    next: () => {
                        this.obtenerHoteles();
                        environment.mensajeToast(
                            'success',
                            'Eliminado con exito',
                            'Se ha eliminado con exito'
                        );
                    },
                    error: () => {
                        environment.mensajeToast('error', 'No se puedo eliminar', 'Elimina las etiquetas')
                    }
                });
            }
        });
    }

    obtenerHoteles() {
        this.hotelesService.getTodosHoteles().subscribe((hoteles) => {
            this.todosHoteles = hoteles;
        });
    }

    obtenerEtiquetas() {
        this.etiquetaHotelService.getEtiquetaHotel().subscribe(etiquetas => {
            this.etiquetas = etiquetas;
        });
    }

    asignarEtiquetaHotel(idEtiqueta: number) {

    }

    obtenerEtiquetasHotel() {
        this.etiquetaHotelService.getEtiquetaDelHotel(this.idHotel).subscribe(etiquetasHotel => {
            this.etiquetasDelHotel = etiquetasHotel;
        });
    }

    eliminarEtiqueta(idEtiquetaHotel: number) {
        environment.mensajeEmergente('¿Estás seguro que deseas eliminar?', 'Esta operación no es reversible', 'warning')
            .then(() => {
                this.etiquetaHotelService.eliminarEtiquetaHotel(idEtiquetaHotel).subscribe({
                    complete: () => {
                        this.obtenerEtiquetasHotel();
                        environment.mensajeToast('success', 'Eliminado con éxito', 'Se ha eliminado con éxito');
                    }
                });
            });
    }

    onFileSelected(event: Event, index: number): void {
        const input = event.target as HTMLInputElement;
        const file = input.files?.[0];

        if (file) {
            this.selectedFiles[index] = file;

            const reader = new FileReader();

            reader.onload = (e: ProgressEvent<FileReader>) => {
                this.imagePreviews[index] = e.target?.result as string;
            };

            reader.readAsDataURL(file);
        } else {
            this.imagePreviews[index] = null;
        }
    }

    obtenerHotelById(idHotel: number) {
        environment.mensajeEmergente('Editar', '¿Estas seguro que deseas editar el hotel?', 'warning')
            .then((continuar) => {
                if (continuar) {
                    this.openCrudModal();
                    this.hotelesService.getHotelById(idHotel).subscribe({
                        next: (hotel) => {
                            this.hotelForm.controls.idHotel.setValue(<string><unknown>hotel.idHotel);
                            this.hotelForm.controls.nombre.setValue(hotel.nombre);
                            this.hotelForm.controls.direccion.setValue(hotel.direccion);
                            this.hotelForm.controls.telefono.setValue(hotel.telefono);
                            this.hotelForm.controls.descripcion.setValue(hotel.descripcion);
                        }
                    });
                }
            });
    }

    obtenerImagesDeHotel(id: number) {
        this.imagePreviews = new Array();
        this.imagenesHotelesService.getImagenesByIdHoteles(id).subscribe(imgHoteles => {
            imgHoteles.forEach((hotel) => {
                this.imagePreviews.push(this.urlHost + hotel.url);
                this.obtenerFile(this.obtenerNombreDeLaFoto(hotel.url));
            });
        });
    }

    obtenerFile(nombreFoto: string) {
        this.imagenesHotelesService.getFile(nombreFoto).subscribe((file: Blob) => {
            const fileFromBlob = new File([file], nombreFoto, { type: file.type });
            this.selectedFiles.push(fileFromBlob);
        });
    }

    obtenerNombreDeLaFoto(url: string): string {
        const parts = url.split('/');
        return parts[parts.length - 1];
    }
}