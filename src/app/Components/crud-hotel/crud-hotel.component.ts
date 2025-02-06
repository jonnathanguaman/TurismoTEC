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
import { Habitaciones } from '../../Services/habitaciones/habitaciones';
import { HabitacionesService } from '../../Services/habitaciones/habitaciones.service';
import { ImagenesHabitacionesService } from '../../Services/imagenesHabitaciones/imagenes-habitaciones.service';

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
    etiquetasDelHotel!: EtiquetaHotel[];
    urlHost: string = environment.urlAut;
    public hotelAAsignar = new Hoteles();

    constructor(
        private hotelesService: HotelesService,
        private habitacionesService: HabitacionesService,
        private lugaresService: LugaresService,
        private fb: FormBuilder,
        private imagenesHotelesService: ImagenesHotelesService,
        private imagenesHabitacionesService: ImagenesHabitacionesService,
        private etiquetaHotelService: EtiquetaHotelService,
        private authService: AuthRegisterService
    ) { }

    ngOnInit(): void {
        this.obtenerHoteles();
        this.obtenerLugaresDeAdmin();
    }

    obtenerLugaresDeAdmin() {
        this.lugaresService.getTodosLugaresDeAdmin().subscribe({
            next: (lugares) => {
                console.log("lugares")
                this.todosLosLugaresCreadosPorAdmin = lugares;
            }
        })
    }

    asignarEtiquetaAHotel(etiqueta: EtiquetaHotel) {
        environment.mensajeEmergente('Agregar etiqueta', '¿Estas seguro que deseas agregar la etiqueta?', 'warning')
            .then((contunuar) => {
                if (contunuar) {
                    this.etiquetaHotelService.agregarHotelAEtiqueta(etiqueta, this.idHotel, 0).subscribe({ //0 es para agregar 1 es para eliminar
                        next: (etiquetaHotellll) => {
                            console.log("etiqueta asignada");
                            if (etiquetaHotellll != null) {
                                environment.mensajeToast('success', 'Etiqueta asignada', 'La etiqueta se asignó con éxito');
                            }
                        },
                        complete: () => {
                            this.cargarEtiquetasEnModal();
                        }
                    });
                }
            });
    }


    eliminarEtiqueta(etiqueta: EtiquetaHotel) {

        environment.mensajeEmergente('¿Estás seguro que deseas eliminar?', 'Esta operación no es reversible', 'warning')
            .then(() => {
                this.etiquetaHotelService.agregarHotelAEtiqueta(etiqueta, this.idHotel, 1).subscribe({
                    complete: () => {
                        this.cargarEtiquetasEnModal();
                        environment.mensajeToast('success', 'Eliminado con exito', 'Se ha eliminado con exito');
                    }
                })
            })

    }


    abrirModalEtiqueta() {
        this.cargarEtiquetasEnModal();
        this.modalEtiqueta = true;
    }

    cargarEtiquetasEnModal() {
        console.log("cargando etiquetas");
        this.etiquetaHotelService.getEtiquetaHotel().subscribe(etiquetas => {
            console.log("cargando etiquetas de hotel");
            const etiquetasTemp = etiquetas;
            console.log(etiquetasTemp);
            this.hotelesService.getHotelById(this.idHotel).subscribe(Hotel => {
                console.log("cargando etiquetas del hotel");
                const etiquetasDelHotelTemp = Hotel?.etiquetasHoteles;
                console.log(etiquetasDelHotelTemp);

                // Aplicar filtro después de que ambas listas estén llenas
                const etiquetasFiltradas = etiquetasTemp.filter(etiqueta =>
                    !etiquetasDelHotelTemp.some(e => e.idEtiquetaHoteles === etiqueta.idEtiquetaHoteles)
                );

                // Asignar los valores después de aplicar el filtro
                this.etiquetasDelHotel = etiquetasDelHotelTemp;
                this.etiquetas = etiquetasFiltradas;
            });
        });
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

    hotelForm = this.fb.group({
        idHotel: [''],
        nombre: ['', [Validators.required]],
        direccion: ['', [Validators.required]],
        telefono: ['', [Validators.required]],
        descripcion: ['', [Validators.required]],
    });

    crearHotel() {
        console.log(this.imagePreviews.length)
        // Verificar si se ha seleccionado un lugar
        const lugarSeleccionado = this.idLugarSeleccionado && this.idLugarSeleccionado !== 0;
        if (this.hotelForm.valid && this.imagePreviews.length >= 3 && lugarSeleccionado) {
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

    isRoomModalOpen: boolean = false; // Controla el estado del modal principal de habitaciones
    isCreateRoomModalOpen: boolean = false; // Controla el estado del modal de creación de habitación

    newRoom = { image: '', name: '', description: '', price: '' }; // Objeto para los datos de la nueva habitación
    rooms: Habitaciones[] = []; // Lista de habitaciones

    habitacionForm = this.fb.group({
        idHabitacion: [''],
        nombreHabitacion: ['', [Validators.required]],
        descripcion: ['', [Validators.required]],
        precio: ['', [Validators.required]]
    });

    // Método para abrir el modal principal de habitaciones
    openRoomModal() {
        this.isRoomModalOpen = true;
        this.cargarHabitaciones();
    }

    // Método para cerrar el modal principal de habitaciones
    closeRoomModal() {
        this.isRoomModalOpen = false;
    }

    // Método para abrir el modal de creación de habitación
    openCreateRoomModal() {
        this.isCreateRoomModalOpen = true; // Mostrar el modal de creación
    }

    // Método para cerrar el modal de creación de habitación
    closeCreateRoomModal() {
        this.isCreateRoomModalOpen = false; // Cerrar el modal de creación
        this.habitacionForm.reset();
        this.selectedFiles = [];
        this.imagePreviews = [];
    }

    // Método para leer la imagen seleccionada y convertirla a base64
    onImageSelected(event: any) {
        const file = event.target.files[0]; // Obtener el archivo de imagen seleccionado
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                this.newRoom.image = reader.result as string; // Guardar la imagen en base64
            };
            reader.readAsDataURL(file); // Leer la imagen como URL de datos (base64)
        }
    }

    cargarHabitaciones() {
        this.habitacionesService.getHabitacionDeHotel(this.idHotel).subscribe({
            next: (habitaciones) => {
                this.rooms = habitaciones;
            }
        });
    }

    crearHabitacion() {
        console.log(this.imagePreviews.length)

        if (this.habitacionForm.valid && this.imagePreviews.length >= 3) {
            this.habitacionesService
                .crearHabitacion(this.habitacionForm.value as unknown as Habitaciones, this.idHotel).subscribe({
                    next: (habitacionCreada: Habitaciones) => {
                        const uploadPromises = this.selectedFiles.map((file) =>
                            this.imagenesHabitacionesService.uploadImage(file, habitacionCreada.idHabitacion).toPromise());
                        Promise.all(uploadPromises)
                            .then(() => {
                                environment.mensajeToast('success', 'Habitación creado', 'Se ha creado la habitación con éxito');
                                this.cargarHabitaciones();
                                this.selectedFiles = [];
                                this.imagePreviews = [];
                                this.closeCreateRoomModal();
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
        } else {
            environment.mensajeToast(
                'error', 'Error al registrar', 'Ingrese todos los campos y seleccione las imágenes else');
        }
    }

    editarHabitacion(idHabitacion: number) {
        environment.mensajeEmergente('Editar', '¿Estas seguro que deseas editar?', 'warning')
            .then((cont) => {
                if (cont) {
                    this.openCreateRoomModal()
                    this.habitacionesService.getHabitacionById(idHabitacion).subscribe({
                        next: (habitacion) => {
                            this.habitacionForm.controls.idHabitacion.setValue(<string><unknown>habitacion.idHabitacion)
                            this.habitacionForm.controls.nombreHabitacion.setValue(habitacion.nombreHabitacion)
                            this.habitacionForm.controls.descripcion.setValue(habitacion.descripcion)
                            this.habitacionForm.controls.precio.setValue(<string><unknown>habitacion.precio)
                        }
                    })
                }
            })
    }

    obtenerImagesDeHabitacion(id: number) {
        console.log("Entro aqui")
        this.imagePreviews = new Array
        this.imagenesHabitacionesService.getImagenesByIdHabitacion(id).subscribe({
            next: (imgHabitaciones) => {
                console.log("next")
                console.log(imgHabitaciones)
                imgHabitaciones.forEach((habitacion) => {

                    //Contruimos la url para la previsualizacion
                    this.imagePreviews.push(this.urlHost + habitacion.url)
                    console.log(this.imagePreviews)
                    this.obtenerFile(this.obtenerNombreDeLaFoto(habitacion.url))
                    console.log(this.selectedFiles)
                })
            },
            error: (e) => {
                console.log("Error al obtener imagenes" + e)
            }
        })
    }

    private imagePreviewsTabla: string[] = [];
    mostrarImagesDeHabitacion(id: number): String {
        console.log("Entro aqui")
        this.imagePreviewsTabla = new Array
        this.imagenesHabitacionesService.getImagenesByIdHabitacion(id).subscribe({
            next: (imgHabitaciones) => {
                console.log("next")
                console.log(imgHabitaciones)
                // imgHabitaciones.forEach((habitacion) => {
                    //Contruimos la url para la previsualizacion
                    this.imagePreviewsTabla.push(this.urlHost + imgHabitaciones[0].url)
                    console.log(this.imagePreviewsTabla)
                    // this.obtenerFile(this.obtenerNombreDeLaFoto(habitacion.url))
                    // console.log(this.selectedFiles)
                // })
            },
            error: (e) => {
                console.log("Error al obtener imagenes" + e)
            }
        })
        return this.imagePreviewsTabla[0]
    }

    // Método para agregar una nueva habitación a la lista
    addRoom() {
        // if (this.newRoom.image && this.newRoom.name && this.newRoom.description && this.newRoom.price) {
        //     this.rooms.push({ ...this.newRoom }); // Agregar la nueva habitación a la lista
        //     this.closeCreateRoomModal(); // Cerrar el modal de creación después de agregar
        // } else {
        //     alert('Por favor, complete todos los campos.'); // Alertar si faltan campos
        // }
    }

    // Método para eliminar una habitación
    deleteRoom(index: number) {
        // if (confirm('¿Está seguro de que desea eliminar esta habitación?')) {
        //     this.rooms.splice(index, 1); // Eliminar la habitación seleccionada
        // }
    }


}