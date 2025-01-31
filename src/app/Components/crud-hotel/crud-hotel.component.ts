import { Component, OnInit } from '@angular/core';
import { HotelesService } from '../../Services/hoteles/hoteles.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Hoteles } from '../../Services/hoteles/hoteles';
import { environment } from '../../../enviroments/enviroment';
import { ImagenesHotelesService } from '../../Services/imagenesHoteles/imagenes-hoteles.service';
import { EtiquetaHotel } from '../../Services/crub-etiqueta-hotel/etiqueta-hotel';
import { EtiquetaHotelService } from '../../Services/crub-etiqueta-hotel/etiqueta-hotel.service';
import { AuthRegisterService } from '../../Services/auth/authRegister.service';
import { TokenPayload } from '../../Services/DatosPersonales/TokenPayload ';
import { jwtDecode } from 'jwt-decode';
import { Lugares } from '../../Services/Lugares/lugares';
import { LugaresService } from '../../Services/Lugares/lugares.service';

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
    todosLosLugaresCreadosPorAdmin!: Lugares[];
    idHotel: number;
    idLugarSeleccionado: number;
    etiquetasDelHotel: EtiquetaHotel[];
    urlHost: string = environment.urlAut;
    //public hotelEtiqueta = new EtiquetaHotel();

    obtenerLugaresDeAdmin() {
        this.lugaresService.getTodosLugaresDeAdmin().subscribe({
            next: (lugares) => {
                this.todosLosLugaresCreadosPorAdmin = lugares;
            }
        })
    }

    onLugarChange(event: any) {
        const lugarId = event.target.value;
        this.idLugarSeleccionado = (this.todosLosLugaresCreadosPorAdmin.find(lugar => lugar.idLugares === +lugarId) || null).idLugares;
        console.log(this.idLugarSeleccionado);
    }


    obtenerEtiquetasHotel() {
        this.etiquetaHotelService.getEtiquetaDelHotel(this.idHotel).subscribe(etiquetasHotel => {
            this.etiquetasDelHotel = etiquetasHotel
        })
    }


    obtenerEtiquetas() {
        this.etiquetaHotelService.getEtiquetaHotel().subscribe(etiquetasObetenidas => {
            this.etiquetas = etiquetasObetenidas;
        });
    }

    abrirModalEtiqueta() {
        //this.obtenerEtiquetas();
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
        private lugaresService: LugaresService,
        private fb: FormBuilder,
        private imagenesHotelesService: ImagenesHotelesService,
        private etiquetaHotelService: EtiquetaHotelService,
        private authService: AuthRegisterService
    ) { }

    ngOnInit(): void {
        this.obtenerHoteles();
        this.obtenerLugaresDeAdmin();
    }

    hotelForm = this.fb.group({
        idHotel: [''],
        nombre: ['', [Validators.required]],
        direccion: ['', [Validators.required]],
        telefono: ['', [Validators.required]],
        descripcion: ['', [Validators.required]],
    });

    crearHotel() {
        console.log(this.imagePreviews.length)
        if (this.hotelForm.valid && this.imagePreviews.length >= 3) {
            const token = sessionStorage.getItem("token")//Obtenemos el token del sesionStorage
            const payload: TokenPayload = jwtDecode(token); //Decodificamos el token, nos devuleve el nombre del usuario
            this.authService.getIdPerson(payload.sub).subscribe({
                next: (idUser) => {
                    this.hotelesService
                        .guardarHotel(this.hotelForm.value as unknown as Hoteles, idUser, this.idLugarSeleccionado).subscribe({
                            next: (hotelcreado: Hoteles) => {
                                this.idHotel = hotelcreado.idHotel;
                                const uploadPromises = this.selectedFiles.map((file) =>
                                    this.imagenesHotelesService.uploadImage(file, hotelcreado.idHotel).toPromise());
                                Promise.all(uploadPromises)
                                    .then(() => {
                                        environment.mensajeToast('success', 'Hotel creado', 'Se ha creado el hotel con exito');
                                        this.obtenerHoteles();
                                        this.closeCrudModal();
                                        this.hotelForm.reset();
                                        this.selectedFiles = [];
                                        this.imagePreviews = [];
                                        this.obtenerEtiquetas()
                                        this.abrirModalEtiqueta()
                                    })
                                    .catch((error) => {
                                        console.error('Error al subir las imágenes:', error);
                                        environment.mensajeToast('error', 'Error al subir las imágenes', 'Ingrese todos los campos y seleccione las imágenes');
                                    });
                            },
                            error: () => {
                                environment.mensajeToast('error', 'Error al registrar', 'Ingrese todos los campos y seleccione las imágenes');
                            }
                        })
                }
            })
        } else {
            environment.mensajeToast(
                'error', 'Error al registrar', 'Ingrese todos los campos y seleccione las imágenes else');
        }
    }

    obtenerHoteles() {
        this.hotelesService.getTodosHoteles().subscribe((hoteles) => {
            this.todosHoteles = hoteles;
        });
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

    onFileSelected(event: Event, index: number): void {

        //Esto es javaScrip basico solo que en lenguaje de ts
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
        environment.mensajeEmergente('Editar', '¿Estas seguro que deseas editar el lugar?', 'warning')
            .then((cont) => {
                if (cont) {
                    this.openCrudModal()
                    this.hotelesService.getHotelById(idHotel).subscribe({
                        next: (hotel) => {
                            this.hotelForm.controls.idHotel.setValue(<string><unknown>hotel.idHotel)
                            this.hotelForm.controls.nombre.setValue(hotel.nombre)
                            this.hotelForm.controls.descripcion.setValue(hotel.descripcion)
                            this.hotelForm.controls.direccion.setValue(hotel.direccion)
                            this.hotelForm.controls.telefono.setValue(hotel.telefono)
                        }
                    })
                }
            })
    }

    obtenerImagesDeHotel(id: number) {
        console.log("Entro aqui")
        this.imagePreviews = new Array
        this.imagenesHotelesService.getImagenesByIdHoteles(id).subscribe({
            next: (imgHoteles) => {
                console.log("next")
                console.log(imgHoteles)
                imgHoteles.forEach((Hotel) => {

                    //Contruimos la url para la previsualizacion
                    this.imagePreviews.push(this.urlHost + Hotel.url)
                    console.log(this.imagePreviews)
                    this.obtenerFile(this.obtenerNombreDeLaFoto(Hotel.url))
                    console.log(this.selectedFiles)
                })
            },
            error: (e) => {
                console.log("Error al obtener imagenes" + e)
            }

        })
    }

    //Obtenemos el la foto en tipo archivo de un lugar en especifico y las agregamos al los arrays para poder subir cuando hacemos el update
    obtenerFile(nombreFoto: string) {
        console.log("Entro a obtener file")
        this.imagenesHotelesService.getFile(nombreFoto).subscribe((file: Blob) => {
            const fileFromBlob = new File([file], nombreFoto, { type: file.type });
            this.selectedFiles.push(fileFromBlob)
        });
    }

    //Obtenermos el nomnbre el archivo para poder buscarlo en la base de datos y obtener el archivo en formato blob
    obtenerNombreDeLaFoto(url: string): string {
        const parts = url.split('/');
        return parts[parts.length - 1];
    }

}