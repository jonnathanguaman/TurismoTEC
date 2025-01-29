import { Component, OnInit } from '@angular/core';
import { HotelesService } from '../../Services/hoteles/hoteles.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Hoteles } from '../../Services/hoteles/hoteles';
import { environment } from '../../../enviroments/enviroment';
import { ImagenesHotelesService } from '../../Services/imagenesHoteles/imagenes-hoteles.service';
import { EtiquetaHotel } from '../../Services/crub-etiqueta-hotel/etiqueta-hotel';
import { EtiquetaHotelService } from '../../Services/crub-etiqueta-hotel/etiqueta-hotel.service';
import { AuthRegisterService } from '../../Services/auth/authRegister.service';
import { MailService } from '../../Services/mailService/mail.service';
import { TokenPayload } from '../../Services/DatosPersonales/TokenPayload ';
import { jwtDecode } from 'jwt-decode';


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
    //public hotelEtiqueta = new EtiquetaHotel();

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
        private authService: AuthRegisterService,
        private mailService: MailService
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

    // crearLugares() {
    //     console.log(this.imagePreviews.length)
    //     if (this.hotelForm.valid && this.imagePreviews.length >= 3) {

    //         const token = sessionStorage.getItem("token")
    //         const payload: TokenPayload = jwtDecode(token);
    //         this.authService.getIdPerson(payload.sub).subscribe({
    //             next: (idUser) => {
    //                 this.hotelesService
    //                     .guardarLugares(this.hotelForm.value as unknown as Hoteles, idUser)
    //                     .subscribe({
    //                         next: (hotelCreado: Hoteles) => {
    //                             this.idLugar = lugarCreado.idLugares
    //                             const uploadPromises = this.selectedFiles.map((file) =>
    //                                 this.imagenesLugaresService.uploadImage(file, lugarCreado.idLugares).toPromise());

    //                             Promise.all(uploadPromises)
    //                                 .then(() => {
    //                                     environment.mensajeToast('success', 'Imágenes subidas', 'Todas las imágenes se subieron correctamente');

    //                                     this.obtenerLugares();
    //                                     this.closeCrudModal();
    //                                     this.lugaresForm.reset();
    //                                     this.selectedFiles = [];
    //                                     this.imagePreviews = [];
    //                                     this.obtenerEtiquetas()
    //                                     this.abrirModalEtiqueta()
    //                                 })
    //                                 .catch((error) => {
    //                                     console.error('Error al subir las imágenes:', error);
    //                                     environment.mensajeToast('error', 'Error al subir las imágenes', 'Ingrese todos los campos y seleccione las imágenes');
    //                                 });

    //                         },
    //                         error: () => {
    //                             environment.mensajeToast('error', 'Error al registrar', 'Ingrese todos los campos y seleccione las imágenes');
    //                         },
    //                     });
    //             }
    //         })
    //     }
    // }

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