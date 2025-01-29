import { Component, OnInit } from '@angular/core';
import { HotelesService } from '../../Services/hoteles/hoteles.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Hoteles } from '../../Services/hoteles/hoteles';
import { environment } from '../../../enviroments/enviroment';
import { ImagenesHotelesService } from '../../Services/imagenesHoteles/imagenes-hoteles.service';
// import { EtiquetasHotel } from '../../Services/categoriasHoteles/categoriaHotel';
// import { CategoriaHotelService } from '../../Services/categoriasHoteles/categoria-hotel.service';
// import { HotelesCategoriasService } from '../../Services/hoteles_Categorias/hoteles-categorias.service';
// import { Hoteles_categoria } from '../../Services/hoteles_Categorias/hoteles_categorias';
import { ImagenesHoteles } from '../../Services/imagenesHoteles/imagesHoteles';
@Component({
    selector: 'app-crud-hotel',
    templateUrl: './crud-hotel.component.html',
    styleUrls: ['./crud-hotel.component.css'],
})
export class CrudHotelComponent implements OnInit {

    isCrudModalOpen: boolean = false;
    imagePreviews: string[] = [];
    selectedFiles: File[] = [];
    //   categorias!: EtiquetasHotel[];
    modalEtiqueta: boolean = false
    todosHoteles!: Hoteles[];
    idHotel: number;
    //   etiquetasDelHotel: Hoteles_categoria[];
    imgDeHoteles: ImagenesHoteles[];
    urlHost: string = environment.urlAut;
    //   public hotelEtiqueta = new Hoteles_categoria();

    abrirModalEtiqueta() {
        // this.obtenerEtiquetas()
        // this.obtenerEtiquetasHotel()
        this.modalEtiqueta = true
    }

    cerrarModalEtiqueta() {
        this.modalEtiqueta = false
    }

    openCrudModal() {
        this.isCrudModalOpen = true;
    }

    closeCrudModal() {
        this.hotelesForm.reset();
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
        // private etiqueraHotelService: CategoriaHotelService,
        // private hotelCategoriaService: HotelesCategoriasService,
    ) { }

    ngOnInit(): void {
        this.obtenerHoteles();
    }

    hotelesForm = this.fb.group({
        idHotel: [''],
        nombre: ['', [Validators.required]],
        direccion: ['', [Validators.required]],
        telefono: ['', [Validators.required]],
        descripcion: ['', [Validators.required]],
        calificacion: ['', [Validators.required]],
    });

    crearHoteles() {
        if (this.hotelesForm.valid && this.imagePreviews.length >= 3) {
            this.hotelesService
                .guardarLugares(this.hotelesForm.value as unknown as Hoteles)
                .subscribe({
                    next: (hotelCreado: Hoteles) => {
                        this.idHotel = hotelCreado.idHotel
                        const uploadPromises = this.selectedFiles.map((file) =>
                            this.imagenesHotelesService.uploadImage(file, hotelCreado.idHotel).toPromise());

                        Promise.all(uploadPromises)
                            .then(() => {
                                environment.mensajeToast('success', 'Imágenes subidas', 'Todas las imágenes se subieron correctamente');

                                this.obtenerHoteles();
                                this.closeCrudModal();
                                this.hotelesForm.reset();
                                this.selectedFiles = [];
                                this.imagePreviews = [];
                                // this.obtenerEtiquetas()
                                this.abrirModalEtiqueta()
                            })
                            .catch((error) => {
                                console.error('Error al subir las imágenes:', error);
                                environment.mensajeToast('error', 'Error al subir las imágenes', 'Ingrese todos los campos y seleccione las imágenes');
                            });

                    },
                    error: () => {
                        environment.mensajeToast('error', 'Error al registrar', 'Ingrese todos los campos y seleccione las imágenes');
                    },
                });
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

    //   obtenerEtiquetas(){
    //       this.etiqueraHotelService.getEtiquetaHotel().subscribe(cat => {
    //         this.categorias = cat;
    //       });
    //     }

    //     asignarEtiquetaHotel(idCategoria:number){
    //       environment.mensajeEmergente('Agregar etiqueta','¿Estas seguro que deseas agregar la etiqueta?', 'warning')
    //       .then((contunuar)=>{
    //         if(contunuar){
    //           this.hotelCategoriaService.crearHotelEtiqueta(this.hotelEtiqueta,this.idHotel,idCategoria).subscribe({
    //             next:(hotelEtiqueta)=>{
    //               console.log(hotelEtiqueta)
    //               if(hotelEtiqueta == null){
    //                 environment.mensajeToast('error','Etiqueta no asiganada','La etiqueta ya pertenece al hotel')
    //               }else{
    //                 environment.mensajeToast('success','Etiqueta asiganada','La etiqueta se asigno con exito')
    //               }
    //             },
    //             complete:()=>{
    //               this.obtenerEtiquetasHotel()

    //             }
    //           })
    //         }
    //       })
    //     }

    //     obtenerEtiquetasHotel(){
    //       this.hotelCategoriaService.getCategoriasDelHotel(this.idHotel).subscribe(etiHotel =>{
    //         this.etiquetasDelHotel = etiHotel
    //       })
    //     }

    //     eliminarEtiqueta(idEtiquetaHotel:number){
    //       environment.mensajeEmergente('¿Estás seguro que deseas eliminar?','Esta operación no es reversible','warning')
    //       .then(()=>{
    //         this.hotelCategoriaService.eliminarHotelEtiqueta(idEtiquetaHotel).subscribe({
    //           complete:()=>{
    //             this.obtenerEtiquetasHotel()
    //             environment.mensajeToast('success','Eliminado con exito','Se ha eliminado con exito');
    //           }
    //         })
    //       })
    //     }

    obtenerHotelById(idHotel: number) {
        environment.mensajeEmergente('Editar', '¿Estas seguro que deseas editar el hotel?', 'warning')
            .then((cont) => {
                if (cont) {
                    this.openCrudModal()
                    this.hotelesService.getHotelById(idHotel).subscribe({
                        next: (hotel) => {
                            this.hotelesForm.controls.idHotel.setValue(<string><unknown>hotel.idHotel)
                            this.hotelesForm.controls.nombre.setValue(hotel.nombre)
                            this.hotelesForm.controls.direccion.setValue(hotel.direccion)
                            this.hotelesForm.controls.telefono.setValue(hotel.telefono)
                            this.hotelesForm.controls.descripcion.setValue(hotel.descripcion)
                            this.hotelesForm.controls.calificacion.setValue(<string><unknown>hotel.calificacion)
                        }
                    })
                }
            })
    }

    obtenerImagesDeHotel(id: number) {
        this.imagePreviews = new Array
        this.imagenesHotelesService.getImagenesByIdHoteles(id).subscribe(imgHoteles => {
            imgHoteles.forEach((hotel) => {
                this.imagePreviews.push(this.urlHost + hotel.url)
                this.obtenerFile(this.obtenerNombreDeLaFoto(hotel.url))
                console.log(this.selectedFiles)
            })
        })
    }
    obtenerFile(nombreFoto: string) {
        this.imagenesHotelesService.getFile(nombreFoto).subscribe((file: Blob) => {
            const fileFromBlob = new File([file], nombreFoto, { type: file.type });
            this.selectedFiles.push(fileFromBlob)
        });
    }

    obtenerNombreDeLaFoto(url: string): string {
        const parts = url.split('/');
        return parts[parts.length - 1];
    }
}
