import { Component, OnInit } from '@angular/core';
import { LugaresService } from '../../Services/Lugares/lugares.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Lugares } from '../../Services/Lugares/lugares';
import { environment } from '../../../enviroments/enviroment';
import { ImagenesLugaresService } from '../../Services/ImagenesLugares/imagenes-lugares.service';
import { EtiquetasLugar } from '../../Services/categoriasLugares/categoriaLugar';
import { CategoriaLugarService } from '../../Services/categoriasLugares/categoria-lugar.service';
import { LugaresCategoriasService } from '../../Services/lugares_Categorias/lugares-categorias.service';
import { Lugares_categoria } from '../../Services/lugares_Categorias/lugares_categrias';
import { ImagenesLugares } from '../../Services/ImagenesLugares/imagenesLugares';
import { AuthRegisterService } from '../../Services/auth/authRegister.service';
import { TokenPayload } from '../../Services/DatosPersonales/TokenPayload ';
import { jwtDecode } from 'jwt-decode';
import { MailService } from '../../Services/mailService/mail.service';

@Component({
  selector: 'app-crud-lugar',
  templateUrl: './crud-lugar.component.html',
  styleUrls: ['./crud-lugar.component.css'],
})

export class CrudLugarComponent implements OnInit {
  
  isCrudModalOpen: boolean = false;
  imagePreviews: string[] = [];
  selectedFiles: File[] = [];
  categorias!: EtiquetasLugar[];
  modalEtiqueta:boolean = false
  todosLugares!: Lugares[];
  idLugar:number
  etiquetasDelLugar:Lugares_categoria[]
  imgDeLugares:ImagenesLugares[]
  urlHost:string = environment.urlAut
  public lugarEtiqueta = new Lugares_categoria()

  //Abre la pestaña para poner etiquetas
  abrirModalEtiqueta(){
    this.obtenerEtiquetas()
    this.obtenerEtiquetasLugar()
    this.modalEtiqueta = true
  }

  //Cierra la pestaña para poner etiquetas
  cerrarModalEtiqueta(){
    this.modalEtiqueta = false
  }

  //Abre la pestaña para crear lugaes
  openCrudModal() {
    this.isCrudModalOpen = true;
  }

  //Cierra la pestaña para crear lugaes
  closeCrudModal() {
    this.lugaresForm.reset();
    this.isCrudModalOpen = false;
    this.selectedFiles = [];
    this.imagePreviews = [];
  }

  //Guardammos el id del lugar cuando damos click en algun boton del html
  guardarIdLugar(idLugar:number){
    this.idLugar = idLugar
  }

  constructor(
    private lugaresService: LugaresService,
    private fb: FormBuilder,
    private imagenesLugaresService: ImagenesLugaresService,
    private etiqueraLugarService:CategoriaLugarService,
    private lugarCategoriaService:LugaresCategoriasService,
    private authService: AuthRegisterService,
    private mailService:MailService
  ) {}

  ngOnInit(): void {
    this.obtenerLugares();
  }


  lugaresForm = this.fb.group({
    idLugares:[''],
    nombre: ['', [Validators.required]],
    descripcion: ['', [Validators.required]],
    direccion: ['', [Validators.required]],
    tipoZona: ['', [Validators.required]],
    areaProtegida: [''],
    patrimonio: [''],
    longitud: ['', [Validators.required]],
    latitud: ['', [Validators.required]],
    visualizacion:['', [Validators.required]],
    aprobado:[true],
    creadoPor:[true]
  });


  crearLugares() {
    console.log(this.imagePreviews.length)
    if (this.lugaresForm.valid && this.imagePreviews.length >= 3) {
      
      const token = sessionStorage.getItem("token")//Obtenemos el token del sesionStorage

      const payload: TokenPayload = jwtDecode(token); //Decodificamos el token, nos devuleve el nombre del usuario

        //Buscamos al usuario por su usermane para obtener el idUsuer
        this.authService.getIdPerson(payload.sub).subscribe({
          next: (idUser) => {

            //Guardamos el lugar 
            this.lugaresService
            .guardarLugares(this.lugaresForm.value as unknown as Lugares,idUser).subscribe({
              next: (lugarCreado: Lugares) => {
                
                  this.idLugar = lugarCreado.idLugares //Capturamos el id del lugar 

                //Creamos una promesa para que primero se guarden todas las fotos 
                const uploadPromises = this.selectedFiles.map((file) =>
                this.imagenesLugaresService.uploadImage(file, lugarCreado.idLugares).toPromise());
                
                //Continuamos con el flujo cuando la promesa se resuelve si no realizamos esto puede que las imagenes no se suban
                Promise.all(uploadPromises)
                  .then(() => {
                    environment.mensajeToast('success','Imágenes subidas','Todas las imágenes se subieron correctamente');
                    this.obtenerLugares();
                    this.closeCrudModal();
                    this.lugaresForm.reset();
                    this.selectedFiles = [];
                    this.imagePreviews = [];
                    this.obtenerEtiquetas()
                    this.abrirModalEtiqueta()
                  })
                  .catch((error) => {
                    console.error('Error al subir las imágenes:', error);
                    environment.mensajeToast('error','Error al subir las imágenes','Ingrese todos los campos y seleccione las imágenes');
                  });
                
              },
              error: () => {
                environment.mensajeToast('error','Error al registrar','Ingrese todos los campos y seleccione las imágenes');
              },
            });
          }})

    } else {
      environment.mensajeToast(
        'error','Error al registrar','Ingrese todos los campos y seleccione las imágenes else');
    }
  }

  //ESTO NO VA EN HOTELES Y RESTAURANTES

  //Cuando el usuario crea un lugar usamos este metodo para aprobar la peticion
  aprobarLugar(id: number) {
    this.lugaresService.aprobarLugar(id, true).subscribe({
      next: () => {
        environment.mensajeToast('success','El lugar se ha sido aprobado','Has aprobado el lugar')
        this.obtenerLugares();
      },
      error: (error) => console.error('Error al aprobar lugar', error)
    });
  }

  //Enviamos el correo de confirmacion para el usuario
  enviarCorreoAprobado(idUser:number){
    this.mailService.enviarCorreoAprobado(idUser).subscribe((response)=>{
      console.log(response)
    })
  }

  //HASTA AQUI

  //Obtenemos la lista completa de los lugares
  obtenerLugares() {
    this.lugaresService.getLugaresAdmin().subscribe((lugares) => {
      this.todosLugares = lugares;
    });
  }

  eliminarLugar(idLugar: number) {
    const mensajeError = environment.mensajeEmergente('¿Estás seguro que deseas eliminar?','Esta operación no es reversible','warning');
    mensajeError.then((confirmado) => {
      if (confirmado) {
        this.lugaresService.eliminarLugar(idLugar).subscribe({
          next: () => {
            this.obtenerLugares();
            environment.mensajeToast(
              'success',
              'Eliminado con exito',
              'Se ha eliminado con exito'
            );
          },
          error:()=>{
            environment.mensajeToast('error','No se puedo eliminar','Elimina las etiquetas')
          }
        });
      }
    });
  }

  //COPIAR TAL CUAL 
  //Este metodo nos ayuda a guardar las imagenes, guarga el archivo file y guarda el nombre
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

  //ESTO NO VA, USAR TU LOGICA
  obtenerEtiquetas(){
      this.etiqueraLugarService.getEtiquetaLugar().subscribe(cat => {
        this.categorias = cat;
      });
    }
    
    asignarEtiquetaLugar(idCategoria:number){
      environment.mensajeEmergente('Agregar etiqueta','¿Estas seguro que deseas agregar la etiqueta?', 'warning')
      .then((contunuar)=>{
        if(contunuar){
          this.lugarCategoriaService.crearLugareEtiqueta(this.lugarEtiqueta,this.idLugar,idCategoria).subscribe({
            next:(lugarEtiqueta)=>{
              console.log(lugarEtiqueta)
              if(lugarEtiqueta == null){
                environment.mensajeToast('error','Etiqueta no asiganada','La etiqueta ya pertenece al lugar')
              }else{
                environment.mensajeToast('success','Etiqueta asiganada','La etiqueta se asigno con exito')
              }
            },
            complete:()=>{
              this.obtenerEtiquetasLugar()
            }
          })
        }
      })
    }

    obtenerEtiquetasLugar(){
      this.lugarCategoriaService.getCategoriasDelLugar(this.idLugar).subscribe(etiLugar =>{
        this.etiquetasDelLugar = etiLugar
      })
    }
    

    eliminarEtiqueta(idEtiquetaLugar:number){
      environment.mensajeEmergente('¿Estás seguro que deseas eliminar?','Esta operación no es reversible','warning')
      .then(()=>{
        this.lugarCategoriaService.eliminarLugarEtiqueta(idEtiquetaLugar).subscribe({
          complete:()=>{
            this.obtenerEtiquetasLugar()
            environment.mensajeToast('success','Eliminado con exito','Se ha eliminado con exito');
          }
        })
      })
    }
    //HASTA AQUI


    //Usamos para cargar al momento de editar
    obtenerLugarById(idLugar:number){
      environment.mensajeEmergente('Editar','¿Estas seguro que deseas editar el lugar?','warning')
      .then((cont)=>{
        if(cont){
          this.openCrudModal()
          this.lugaresService.getLugarById(idLugar).subscribe({
            next:(lugar)=>{
              this.lugaresForm.controls.idLugares.setValue(<string><unknown>lugar.idLugares)
              this.lugaresForm.controls.nombre.setValue(lugar.nombre)
              this.lugaresForm.controls.descripcion.setValue(lugar.descripcion)
              this.lugaresForm.controls.direccion.setValue(lugar.direccion)
              this.lugaresForm.controls.tipoZona.setValue(lugar.tipoZona)
              this.lugaresForm.controls.areaProtegida.setValue(<string><unknown> lugar.areaProtegida)
              this.lugaresForm.controls.patrimonio.setValue(<string><unknown> lugar.patrimonio)
              this.lugaresForm.controls.longitud.setValue(<string><unknown> lugar.longitud)
              this.lugaresForm.controls.latitud.setValue(<string><unknown>lugar.latitud)
              this.lugaresForm.controls.aprobado.setValue(lugar.aprobado)
              this.lugaresForm.controls.visualizacion.setValue(<string><unknown> lugar.visualizacion)
            }
          })
        }
      })
    }

    //Obtenemos las images de un lugar en especifico y las agregamos al los arrays para poder subir cuando hacemos el update
    obtenerImagesDeLugar(id:number){
      this.imagePreviews = new Array
      this.imagenesLugaresService.getImagenesByIdLugares(id).subscribe(imgLugares =>{
        imgLugares.forEach((lugar) =>{

        //Contruimos la url para la previsualizacion
        this.imagePreviews.push(this.urlHost + lugar.url)
        
        this.obtenerFile(this.obtenerNombreDeLaFoto(lugar.url))
        console.log(this.selectedFiles)
       })
      })
    }


    //Obtenemos el la foto en tipo archivo de un lugar en especifico y las agregamos al los arrays para poder subir cuando hacemos el update
    obtenerFile(nombreFoto: string) {
      this.imagenesLugaresService.getFile(nombreFoto).subscribe((file: Blob) => {
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
