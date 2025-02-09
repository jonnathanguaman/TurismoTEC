import { Component, Input, OnInit } from '@angular/core';
import { ReservaHatitacion } from '../../Services/registrarReservaHabitacion/reservaHotel';
import { ReservaHotelService } from '../../Services/registrarReservaHabitacion/reserva-hotel.service';
import { HabitacionesService } from '../../Services/habitaciones/habitaciones.service';
import { jwtDecode } from 'jwt-decode';
import { TokenPayload } from '../../Services/DatosPersonales/TokenPayload ';
import { AuthRegisterService } from '../../Services/auth/authRegister.service';
import { AuthService } from '../../Services/login/login.service';
import { environment } from '../../../enviroments/enviroment';
import { Habitaciones } from '../../Services/habitaciones/habitaciones';
import { ImagenesHabitacion } from '../../Services/imagenesHabitaciones/imagenesHabitacion';
import { ImagenesHabitacionesService } from '../../Services/imagenesHabitaciones/imagenes-habitaciones.service';

@Component({
  selector: 'app-crud-reservas-habitacion',
  templateUrl: './crud-reservas-habitacion.component.html',
  styleUrl: './crud-reservas-habitacion.component.css'
})
export class CrudReservasHabitacionComponent implements OnInit{

  admin:boolean = true
  asociado:boolean = false
  reserva:ReservaHatitacion
  disabledDates = [''];
  fechaActual:string =<string> <unknown>new Date()

  urlHost: string = environment.urlAut;
  
  rangeValue: { Desde: Date; hasta: Date } = {
    Desde: null,
    hasta: null
  };  

  isCrudModalOpen: boolean = false;
  editar:boolean = false

  todasLasReservaciones:ReservaHatitacion[]

  constructor(
    private reservaHotelService:ReservaHotelService,
    private authService: AuthRegisterService,
    private loginService:AuthService,
    private imagenesHabitacionesService: ImagenesHabitacionesService,
  ){}
    
  ngOnInit(): void {
    this.loginService.getRoles()
    this.loginService.admin.subscribe({next:(admin) =>{this.admin = admin}})
    this.loginService.asociado.subscribe({next:(asociado) =>{this.asociado = asociado}})

    this.comprarHaQuienMostrar()
  }

  comprarHaQuienMostrar(){
    if(this.admin && !this.asociado){
      console.log("Entro en admin")
      this.obtenerReservas()
    }else if(!this.admin && !this.asociado){
      console.log("Entro en usuario")
      this.obtenerReservacionesDeUsuarios()
    }else if(this.asociado){
      this.obtenerReservasDeHotelesByAsociado()
    }
  }

  obtenerReservas(){
    this.reservaHotelService.getReservasHabitaciones().subscribe({
      next:(reservas)=>{
        console.log(reservas)
        this.todasLasReservaciones = reservas
        this.todasLasReservaciones.forEach((reservas)=>{
          this.obtenerImagesDeHabitaciones(reservas.habitaciones.idHabitacion).then((img)=>{
            reservas.habitaciones.imagenesHabitaciones = img
          })
        })
      }
    })
  }

  obtenerReservacionesDeUsuarios(){
    const token = sessionStorage.getItem('token');
    const payload: TokenPayload = jwtDecode(token);
    this.authService.getIdPerson(payload.sub).subscribe({
      next:(idPersona)=>{
        this.reservaHotelService.getReservasUser(idPersona).subscribe({
          next:(reservasUsuario)=>{
            this.todasLasReservaciones = reservasUsuario 
            this.todasLasReservaciones.forEach((reservas)=>{
              this.obtenerImagesDeHabitaciones(reservas.habitaciones.idHabitacion).then((img)=>{
                reservas.habitaciones.imagenesHabitaciones = img
              })
            })
          }
        })
      }
    })
  }

  obtenerReservasDeHotelesByAsociado(){
    const token = sessionStorage.getItem('token');
    const payload: TokenPayload = jwtDecode(token);
    this.authService.getIdPerson(payload.sub).subscribe({
      next:(idPersona)=>{
        this.reservaHotelService.getReservasDeHotelesByAsociado(idPersona).subscribe({
          next:(reservasUsuario)=>{
            this.todasLasReservaciones = reservasUsuario 
            this.todasLasReservaciones.forEach((reservas)=>{
              this.obtenerImagesDeHabitaciones(reservas.habitaciones.idHabitacion).then((img)=>{
                reservas.habitaciones.imagenesHabitaciones = img
              })
            })
          }
        })
    }})
  }

  obtenerImagesDeHabitaciones(idHoteles:number):Promise<ImagenesHabitacion[]>{
    return new Promise((resolve,reject) =>{
      this.imagenesHabitacionesService.getImagenesByIdHabitacion(idHoteles).subscribe(
          imgHoteles => resolve(imgHoteles),
          error => reject(error)
        )
    })
}

  idHabitacion:number
  openCrudModal(idHabitacion:number) {
    this.idHabitacion = idHabitacion
    environment.mensajeEmergente('Editar reservación','¿Estas seguro que deseas editar la reservacion?','warning').
    then((confirmar)=>{
      if(confirmar){
        this.cargarFechas(idHabitacion).then(()=>{
          this.isCrudModalOpen = true;
        })
      }
    })
  }

  closeCrudModal() {
    this.isCrudModalOpen = false;
  }

  
  
  limpiarFecha(){
    this.rangeValue = { Desde: null, hasta: null };
  }

  cargarFechas(idHbitacion:number): Promise<void> {
    return new Promise((resolve, reject) => {
      if (idHbitacion) {
            this.obtenerFechasReservadas(idHbitacion).then(() => {
              resolve(); // Resuelve la promesa cuando las fechas están listas
            }).catch(error => {
              reject(error); // Rechaza la promesa si ocurre un error al cargar las fechas
            });
      } else {
        reject('No se proporcionó un ID de habitación'); // Manejo de error si no hay ID de habitación
      }
    });
  }

  obtenerFechasReservadas(idHabitacion: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.reservaHotelService.getFechasReservadas(idHabitacion).subscribe({
        next: (fechasReservadas) => {
          fechasReservadas.forEach((fecha: Date) => {
            this.disabledDates.push(this.formatearFecha(new Date(fecha)));
            console.log(this.formatearFecha(new Date(fecha)));
          });
          resolve(); // Resuelve la promesa cuando las fechas están completamente procesadas
        },
        error: (err) => {
          console.error('Error al cargar las fechas reservadas:', err);
          reject(err); // Rechaza la promesa si ocurre un error
        }
      });
    });
  }

  obtenerReservaById(idReserva:number){
    this.reservaHotelService.getReservaById(idReserva).subscribe({
      next:(reserva)=>{
        this.reserva = reserva
      }
    })
  }
  
  formatearFecha(fecha: Date): string {
    const año = fecha.getFullYear();
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const día = fecha.getDate().toString().padStart(2, '0');
    return `${año}-${mes}-${día}`;
  }

  dividirDechas(cadenaFecha:string):Date[]{
    try{
      const fecha = cadenaFecha.split("to")
      const fechaInicio = new Date(fecha[0].trim());
      const fechaFin = new Date(fecha[1].trim());  
      fechaInicio.setDate(fechaInicio.getDate() + 1);
      fechaFin.setDate(fechaFin.getDate() + 1);
      return [fechaInicio,fechaFin]
    }catch{
      environment.mensajeToast('error','Por favor selecione un fecha','La fecha es obligatoria')
      return null;
    }
  }


  actualizarReservacion(){
    try{
      const token = sessionStorage.getItem('token')
      if(token){
        const fechaInicio = this.dividirDechas(<string><unknown>this.rangeValue)[0]
        const fechaFinal = this.dividirDechas(<string><unknown>this.rangeValue)[1]
        const payload: TokenPayload = jwtDecode(token); 
        if(fechaInicio && fechaFinal){
          this.authService.getIdPerson(payload.sub).subscribe({
            next:(idUsuario)=>{
              this.reserva.fechaIncioReserva = fechaInicio
              this.reserva.fechaFinReserva = fechaFinal
              this.reservaHotelService.guardarReservaHabitacion(this.reserva,idUsuario,this.idHabitacion).subscribe({
                complete:()=>{
                  this.limpiarFecha()
                  this.closeCrudModal()
                  environment.mensajeToast('success','Reserva actualizada',"La fecha de la reserva se actualizo")
                  this.disabledDates = [];
                  this.obtenerReservacionesDeUsuarios()
                },
                error:()=>{
                  environment.mensajeToast('error','Lo sentimos algo salio mal','Hemos enviado el error a los responsables, lamentamos las molestias')
                }
              })
            }
        })
        }else{
          environment.mensajeToast('warning','No se ha completado la actulizacion','Por favor ingrese la fecha')
        }
        
      }else{
        environment.mensajeToast('warning','No se ha completado la reserva','Por favor inicie sesion')
      }
    }catch{
    }
  }

  cancelarReservacion(idReservacion:number){
    environment.mensajeEmergente('Cancelar reservación','¿Estas seguro que deseas cancelar la reservacion?','warning').
    then((confirmar)=>{
      if(confirmar){
        this.reservaHotelService.eliminarReservacion(idReservacion).subscribe({
          complete:()=>{
            environment.mensajeToast('success','Reservación cancelada','Se ha cancelado la reservacion con exito')
            this.comprarHaQuienMostrar()
          }
        })
      }
    })
  }

}
