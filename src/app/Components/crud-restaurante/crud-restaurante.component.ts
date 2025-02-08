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

@Component({
    selector: 'app-crud-restaurante',
    templateUrl: './crud-restaurante.component.html',
    styleUrls: ['./crud-restaurante.component.css'],
})
export class CrudRestauranteComponent implements OnInit {


      isRoomModalOpen: boolean = false; // Controla el estado del modal principal de habitaciones
            isCreateRoomModalOpen: boolean = false; // Controla el estado del modal de creación de habitación
            
            newRoom = { image: '', name: '', description: '', price: '' }; // Objeto para los datos de la nueva habitación
            rooms: any[] = []; // Lista de habitaciones
        
            // Método para abrir el modal principal de habitaciones
            openRoomModal() {
                this.isRoomModalOpen = true;
            }
        
            // Método para cerrar el modal principal de habitaciones
            closeRoomModal() {
                this.isRoomModalOpen = false;
            }
        
            // Método para abrir el modal de creación de habitación
            openCreateRoomModal() {
                this.isCreateRoomModalOpen = true; // Mostrar el modal de creación
                this.newRoom = { image: '', name: '', description: '', price: null }; // Reiniciar los datos de la nueva habitación
            }
        
            // Método para cerrar el modal de creación de habitación
            closeCreateRoomModal() {
                this.isCreateRoomModalOpen = false; // Cerrar el modal de creación
            }
    

    isCrudModalOpen: boolean = false;
    imagePreviews: string[] = [];
    selectedFiles: File[] = [];
    etiquetas!: EtiquetaRestaurante[];
    modalEtiqueta: boolean = false;
    todosRestaurantes!: Restaurante[];
    todosLosLugaresCreadosPorAdmin!: Lugares[];
    idRestaurante: number;
    idLugarSeleccionado: number;
    etiquetasDelRestaurante!: EtiquetaRestaurante[];
    urlHost: string = environment.urlAut;
    asociado:boolean = false;

    public restauranteAAsignar = new Restaurante();

    constructor(
        private restaurantesService: RestauranteService,
        private lugaresService: LugaresService,
        private fb: FormBuilder,
        private imagenesRestaurantesService: ImagenesRestaurantesService,
        private etiquetaRestauranteService: EtiquetaRestauranteService,
        private authService: AuthRegisterService,
        private loginService:AuthService
    ) { }

    ngOnInit(): void {
        this.loginService.asociado.subscribe({next:(asociado) =>{this.asociado = asociado}})
        
        this.obtenerLugaresDeAdmin();
        if(this.asociado){
            this.obtenerRestaurantesDeAsociado();
        }else{
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
        });
    }

    obtenerRestaurantesDeAsociado(){
        const token = sessionStorage.getItem("token")//Obtenemos el token del sesionStorage
        const payload: TokenPayload = jwtDecode(token); //Decodificamos el token, nos devuleve el nombre del usuario
        this.authService.getIdPerson(payload.sub).subscribe({
        next: (idUser) => {
            this.restaurantesService.getRestaurantesByIdUser(idUser).subscribe({
                next:(restauranteUser)=>{
                    this.todosRestaurantes = restauranteUser;
                }
            })
        }})
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
                                const uploadPromises = this.selectedFiles.map((file) =>
                                    this.imagenesRestaurantesService.uploadImage(file, restauranteCreado.idRestaurante).toPromise());
                                Promise.all(uploadPromises)
                                    .then(() => {
                                        environment.mensajeToast('success', 'Hotel creado', 'Se ha creado el hotel con exito');
                                        if(this.asociado){
                                            this.obtenerRestaurantesDeAsociado();
                                        }else{
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
                        if(this.asociado){
                            this.obtenerRestaurantesDeAsociado();
                        }else{
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
        this.imagePreviews = new Array
        this.imagenesRestaurantesService.getImagenesByIdRestaurantes(id).subscribe({
            next: (imgRestaurantes) => {
                imgRestaurantes.forEach((Hotel) => {

                    //Contruimos la url para la previsualizacion
                    this.imagePreviews.push(this.urlHost + Hotel.url)
                    this.obtenerFile(this.obtenerNombreDeLaFoto(Hotel.url))

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

}
