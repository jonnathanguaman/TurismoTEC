import { Component, OnInit } from '@angular/core';
import { RestauranteService } from '../../Services/restaurantes/restaurante.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Restaurante } from '../../Services/restaurantes/restaurante';
import { environment } from '../../../enviroments/enviroment';
import { ImagenesRestaurantesService } from '../../Services/imagenesRestaurantes/imagenes-restaurantes.service';
import { EtiquetaRestaurante } from '../../Services/crud-etiqueta-restaurante/etiqueta-Restaurante';
import { EtiquetaRestauranteService } from '../../Services/crud-etiqueta-restaurante/etiqueta-Restaurante.service';
import { AuthRegisterService } from '../../Services/auth/authRegister.service';
import { TokenPayload } from '../../Services/DatosPersonales/TokenPayload ';
import { jwtDecode } from 'jwt-decode';
import { Lugares } from '../../Services/Lugares/lugares';
import { LugaresService } from '../../Services/Lugares/lugares.service';
import { AuthService } from '../../Services/login/login.service';
import { ImagenesRestaurantes } from '../../Services/imagenesRestaurantes/imagenesRestaurantes';
import { Mesa } from '../../Services/mesas/mesas';
import { MesasService } from '../../Services/mesas/mesas.service';
import { ImagenesMesas } from '../../Services/imagenesMesas/imagenesMesas';
import { ImagenesMesasService } from '../../Services/imagenesMesas/imagenes-mesas.service';

@Component({
    selector: 'app-crud-restaurante',
    templateUrl: './crud-restaurante.component.html',
    styleUrls: ['./crud-restaurante.component.css'],
})
export class CrudRestauranteComponent implements OnInit {


    isCrudModalOpen: boolean = false;
    imagePreviews: string[] = [];
    selectedFiles: File[] = [];
    mesas: Mesa[] = [];
    etiquetas!: EtiquetaRestaurante[];
    modalEtiqueta: boolean = false;
    todosRestaurantes!: Restaurante[];
    todosLosLugaresCreadosPorAdmin!: Lugares[];
    idRestaurante: number;
    idLugarSeleccionado: number;
    etiquetasDelRestaurante: EtiquetaRestaurante[];
    urlHost: string = environment.urlAut;
    asociado: boolean = false;

    public restauranteAAsignar = new Restaurante();

    constructor(
        private mesasService: MesasService,
        private restaurantesService: RestauranteService,
        private lugaresService: LugaresService,
        private fb: FormBuilder,
        private imagenesMesasService: ImagenesMesasService,
        private imagenesRestaurantesService: ImagenesRestaurantesService,
        private etiquetaRestauranteService: EtiquetaRestauranteService,
        private authService: AuthRegisterService,
        private loginService: AuthService
    ) { }

    ngOnInit(): void {
        this.loginService.asociado.subscribe({ next: (asociado) => { this.asociado = asociado } })

        this.obtenerLugaresDeAdmin();
        if (this.asociado) {
            this.obtenerRestaurantesDeAsociado();
        } else {
            this.obtenerRestaurantes();
        }
    }

    restauranteForm = this.fb.group({
        idRestaurante: [''],
        nombre: ['', [Validators.required]],
        direccion: ['', [Validators.required]],
        telefono: ['', [Validators.required]],
        descripcion: ['', [Validators.required]],
        menu: ['', [Validators.required]]
    });

    obtenerRestaurantes() {
        this.restaurantesService.getTodosRestaurantes().subscribe((restaurantes) => {
            this.todosRestaurantes = restaurantes;
            this.todosRestaurantes.forEach((restaurante) => {
                console.log("Entro aqui")
                this.obtenerImagesDeRestaurantes(restaurante.idRestaurante).then((img) => {
                    restaurante.imagenesRestaurantes = img
                })
            })
        });
    }

    obtenerImagesDeRestaurantes(idRestaurante: number): Promise<ImagenesRestaurantes[]> {
        return new Promise((resolve, reject) => {
            this.imagenesRestaurantesService.getImagenesByIdRestaurantes(idRestaurante).subscribe(
                imgRestaurante => resolve(imgRestaurante),
                error => reject(error)
            )
        })
    }

    obtenerRestaurantesDeAsociado() {
        const token = sessionStorage.getItem("token")//Obtenemos el token del sesionStorage
        const payload: TokenPayload = jwtDecode(token); //Decodificamos el token, nos devuleve el nombre del usuario
        this.authService.getIdPerson(payload.sub).subscribe({
            next: (idUser) => {
                this.restaurantesService.getRestaurantesByIdUser(idUser).subscribe({
                    next: (restauranteUser) => {
                        this.todosRestaurantes = restauranteUser;
                    }
                })
            }
        })
    }


    obtenerLugaresDeAdmin() {
        this.lugaresService.getTodosLugaresDeAdmin().subscribe({
            next: (lugares) => {
                this.todosLosLugaresCreadosPorAdmin = lugares;
            }
        });
    }

    asignarEtiquetaARestaurante(etiqueta: EtiquetaRestaurante) {
        environment.mensajeEmergente('Agregar etiqueta', '¿Estas seguro que deseas agregar la etiqueta?', 'warning')
            .then((contunuar) => {
                if (contunuar) {
                    this.etiquetaRestauranteService.agregarRestauranteAEtiqueta(etiqueta, this.idRestaurante, 0).subscribe({ //0 es para agregar 1 es para eliminar
                        next: (etiquetaRestaurante) => {
                            console.log("etiqueta asignada");
                            if (etiquetaRestaurante != null) {
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

    eliminarEtiqueta(etiqueta: EtiquetaRestaurante) {

        environment.mensajeEmergente('¿Estás seguro que deseas eliminar?', 'Esta operación no es reversible', 'warning')
            .then(() => {
                this.etiquetaRestauranteService.agregarRestauranteAEtiqueta(etiqueta, this.idRestaurante, 1).subscribe({
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
        this.etiquetaRestauranteService.getEtiquetaRestaurante().subscribe(etiquetas => {
            console.log("cargando etiquetas de restaurante");
            const etiquetasTemp = etiquetas;
            console.log(etiquetasTemp);
            this.etiquetaRestauranteService.getEtiquetaDelRestaurante(this.idRestaurante).subscribe(restaurante => {
                console.log(restaurante);
                console.log("cargando etiquetas del restaurante");
                const etiquetasDelRestauranteTemp = restaurante;
                console.log(etiquetasDelRestauranteTemp);
                // Aplicar filtro después de que ambas listas estén llenas
                const etiquetasFiltradas = etiquetasTemp.filter(etiqueta =>
                    !etiquetasDelRestauranteTemp.some(e => e.idEtiquetaRestaurante === etiqueta.idEtiquetaRestaurante)
                );

                // Asignar los valores después de aplicar el filtro
                this.etiquetasDelRestaurante = etiquetasDelRestauranteTemp;
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
        this.restauranteForm.reset();
        this.isCrudModalOpen = false;
        this.selectedFiles = [];
        this.imagePreviews = [];
    }

    guardarIdRestaurante(idRestaurante: number) {
        this.idRestaurante = idRestaurante;
    }

    crearRestaurante() {
        console.log(this.imagePreviews.length)
        // Verificar si se ha seleccionado un lugar
        const lugarSeleccionado = this.idLugarSeleccionado && this.idLugarSeleccionado !== 0;
        if (this.restauranteForm.valid && this.imagePreviews.length >= 3 && lugarSeleccionado) {
            const token = sessionStorage.getItem("token")//Obtenemos el token del sesionStorage
            const payload: TokenPayload = jwtDecode(token); //Decodificamos el token, nos devuleve el nombre del usuario
            this.authService.getIdPerson(payload.sub).subscribe({
                next: (idUser) => {
                    this.restaurantesService
                        .guardarRestaurante(this.restauranteForm.value as unknown as Restaurante, idUser, this.idLugarSeleccionado).subscribe({
                            next: (restauranteCreado: Restaurante) => {
                                this.idRestaurante = restauranteCreado.idRestaurante;
                                console.log("Imagenes create" + this.selectedFiles)
                                const uploadPromises = this.selectedFiles.map((file) =>
                                    this.imagenesRestaurantesService.uploadImage(file, restauranteCreado.idRestaurante).toPromise());
                                console.log(restauranteCreado.idRestaurante)

                                Promise.all(uploadPromises)
                                    .then(() => {
                                        environment.mensajeToast('success', 'Hotel creado', 'Se ha creado el hotel con exito');
                                        if (this.asociado) {
                                            this.obtenerRestaurantesDeAsociado();
                                        } else {
                                            this.obtenerRestaurantes();
                                        }
                                        this.closeCrudModal();
                                        this.restauranteForm.reset();
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



    eliminarRestaurante(idRestaurante: number) {
        const mensajeError = environment.mensajeEmergente(
            '¿Estás seguro que deseas eliminar?',
            'Esta operación no es reversible',
            'warning'
        );
        mensajeError.then((confirmado) => {
            if (confirmado) {
                this.restaurantesService.eliminarRestaurante(idRestaurante).subscribe({
                    next: () => {
                        if (this.asociado) {
                            this.obtenerRestaurantesDeAsociado();
                        } else {
                            this.obtenerRestaurantes();
                        }
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

    obtenerRestauranteById(idRestaurante: number) {
        environment.mensajeEmergente('Editar', '¿Estas seguro que deseas editar el lugar?', 'warning')
            .then((cont) => {
                if (cont) {
                    this.openCrudModal()
                    this.restaurantesService.getRestauranteById(idRestaurante).subscribe({
                        next: (restaurante) => {
                            this.restauranteForm.controls.idRestaurante.setValue(<string><unknown>restaurante.idRestaurante)
                            this.restauranteForm.controls.nombre.setValue(restaurante.nombre)
                            this.restauranteForm.controls.descripcion.setValue(restaurante.descripcion)
                            this.restauranteForm.controls.direccion.setValue(restaurante.direccion)
                            this.restauranteForm.controls.telefono.setValue(restaurante.telefono)
                            this.restauranteForm.controls.menu.setValue(restaurante.menu)
                        }
                    })
                }
            })
    }

    obtenerImagesDeRestaurante(id: number) {
        this.imagePreviews = [];
        this.selectedFiles = [];

        this.imagePreviews = new Array
        this.imagenesRestaurantesService.getImagenesByIdRestaurantes(id).subscribe(imgRestaurante => {
            imgRestaurante.forEach((Hotel) => {

                //Contruimos la url para la previsualizacion
                this.imagePreviews.push(this.urlHost + Hotel.url)
                this.obtenerFile(this.obtenerNombreDeLaFoto(Hotel.url))
                console.log(this.selectedFiles)
            })
        })
    }

    //Obtenemos el la foto en tipo archivo de un lugar en especifico y las agregamos al los arrays para poder subir cuando hacemos el update
    obtenerFile(nombreFoto: string) {
        console.log("Entro a obtener file")
        this.imagenesRestaurantesService.getFile(nombreFoto).subscribe((file: Blob) => {
            const fileFromBlob = new File([file], nombreFoto, { type: file.type });
            this.selectedFiles.push(fileFromBlob)
        });
    }

    //Obtenermos el nomnbre el archivo para poder buscarlo en la base de datos y obtener el archivo en formato blob
    obtenerNombreDeLaFoto(url: string): string {
        const parts = url.split('/');
        return parts[parts.length - 1];
    }

    public isMesaModalOpen = false;
    public isCreateMesaModalOpen = false;


    MesaForm = this.fb.group({
        idMesa: [''],
        numeroMesa: ['', [Validators.required]],
        capacidad: ['', [Validators.required]],
        disponibilidad: ['', [Validators.required]],
    })

    openMesaModal() {
        this.cargarMesas();
        this.isMesaModalOpen = true;

    }
    closeMesaModal() {
        this.isMesaModalOpen = false;
    }

    openCreateMesaModal() {
        this.isCreateMesaModalOpen = true;
    }

    closeCreateMesaModal() {
        this.isCreateMesaModalOpen = false; // Cerrar el modal de creación
        this.MesaForm.reset();
        this.selectedFiles = [];
        this.imagePreviews = [];
    }

    mostrarImagesDeMesas() { }

    cargarMesas() {
        console.log("Entro a cargar mesas")
        console.log(this.idRestaurante)
        // this.mesasService.getMesasDeRestaurante(this.idRestaurante).subscribe((mesas) => {
        //     this.mesas = mesas;
        //     this.mesas.forEach((mesas) => {
        //         this.obtenerImagesDeMesas(mesas.idMesa).then((img) => {
        //             mesas.imagenesMesa = img
        //         })
        //     })
        // });
        this.mesasService.getMesasDeRestaurante(this.idRestaurante).subscribe({
            next: (mesas) => {
                console.log("Datos recibidos:", mesas);
                this.mesas = mesas;
                this.mesas.forEach((mesa) => {
                    if (!mesa.idMesa) {
                        console.error("Error: idMesa es undefined en una de las mesas", mesa);
                        return;
                    }
                    this.obtenerImagesDeMesas(mesa.idMesa)
                        .then((img) => mesa.imagenesMesa = img)
                        .catch((error) => console.error("Error obteniendo imágenes:", error));
                });
            },
            error: (err) => {
                console.error("Error en la petición HTTP:", err);
            }
        });

    }

    editarMesa(idMesa: number) {
        environment.mensajeEmergente('Editar', '¿Estas seguro que deseas editar?', 'warning')
            .then((cont) => {
                if (cont) {
                    this.openCreateMesaModal()
                    this.mesasService.getMesaById(idMesa).subscribe({
                        next: (mesa) => {
                            this.MesaForm.controls.idMesa.setValue(<string><unknown>mesa.idMesa)
                            this.MesaForm.controls.numeroMesa.setValue(mesa.numeroMesa)
                            this.MesaForm.controls.capacidad.setValue(mesa.capacidad)
                            this.MesaForm.controls.disponibilidad.setValue(<string><unknown>mesa.disponibilidad)
                        }
                    })
                }
            })
    }
    //para mostrar en la tabla lo llamo desde cargarMesas
    obtenerImagesDeMesas(idMesa: number): Promise<ImagenesMesas[]> {
        return new Promise((resolve, reject) => {
            this.imagenesMesasService.getImagenesByIdMesa(idMesa).subscribe(
                imgMesas => resolve(imgMesas),
                error => reject(error)
            )
        })
    }
    //para editar una mesa
    obtenerImagesDeMesa(id: number) {
        console.log("Entro aqui")
        this.imagePreviews = new Array
        this.imagenesMesasService.getImagenesByIdMesa(id).subscribe({
            next: (imgMesas) => {
                console.log("next")
                console.log(imgMesas)
                imgMesas.forEach((mesa) => {

                    //Contruimos la url para la previsualizacion
                    this.imagePreviews.push(this.urlHost + mesa.url)
                    console.log(this.imagePreviews)
                    this.obtenerFile(this.obtenerNombreDeLaFoto(mesa.url))
                    console.log(this.selectedFiles)
                })
            },
            error: (e) => {
                console.log("Error al obtener imagenes" + e)
            }
        })
    }

    eliminarMesa(idMesa: number) {
        const mensajeError = environment.mensajeEmergente(
            '¿Estás seguro que deseas eliminar?',
            'Esta operación no es reversible',
            'warning'
        );
        mensajeError.then((confirmado) => {
            if (confirmado) {
                this.mesasService.eliminarMesa(idMesa).subscribe({
                    next: () => {

                        this.cargarMesas();

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

    crearMesa() {
        console.log(this.imagePreviews.length)
        console.log(this.MesaForm.valid)
        if (this.MesaForm.valid && this.imagePreviews.length >= 3) {
            this.mesasService
                .crearMesa(this.MesaForm.value as unknown as Mesa, this.idRestaurante).subscribe({
                    next: (mesaCreada: Mesa) => {
                        const uploadPromises = this.selectedFiles.map((file) =>
                            this.imagenesMesasService.uploadImage(file, mesaCreada.idMesa).toPromise());
                        Promise.all(uploadPromises)
                            .then(() => {
                                environment.mensajeToast('success', 'Habitación creado', 'Se ha creado la habitación con éxito');
                                this.cargarMesas();
                                this.selectedFiles = [];
                                this.imagePreviews = [];
                                this.closeCreateMesaModal();
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

}
