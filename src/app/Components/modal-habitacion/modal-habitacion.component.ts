import { Component, Input, OnInit } from '@angular/core';
import { HabitacionesService } from '../../Services/habitaciones/habitaciones.service';
import { Habitaciones } from '../../Services/habitaciones/habitaciones';
import { ReservaHotelService } from '../../Services/registrarReservaHabitacion/reserva-hotel.service';
import { ReservaHatitacion } from '../../Services/registrarReservaHabitacion/reservaHotel';
import { environment } from '../../../enviroments/enviroment';
import { AuthRegisterService } from '../../Services/auth/authRegister.service';
import { jwtDecode } from 'jwt-decode';
import { TokenPayload } from '../../Services/DatosPersonales/TokenPayload ';
import { MailService } from '../../Services/mailService/mail.service';
@Component({
  selector: 'app-modal-habitacion',
  templateUrl: './modal-habitacion.component.html',
  styleUrl: './modal-habitacion.component.css',
})
export class ModalHabitacionComponent implements OnInit{
  @Input() idHabitacion?:number
  
  constructor(
    private habitacionService:HabitacionesService,
    private reservaHotelService:ReservaHotelService,
    private authService: AuthRegisterService,
    private mailService:MailService,)
    {}
    selectedDate:string = ''
    fechasReservadas:Date[]
    disabledDates = [''];
    
  ngOnInit(): void {
  }

  fechaActual:string =<string> <unknown>new Date()

  
  rangeValue: { Desde: Date; hasta: Date } = {
    Desde: null,
    hasta: null
  };



  habitacion!:Habitaciones
  isVisible: boolean = false;

  cerrarModal(): void {
    this.isVisible = false;
    this.disabledDates = [];
  }


  public reserva = new ReservaHatitacion();

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


  crearReservacionDeHabitacion(){
    try{
      const token = sessionStorage.getItem('token')
      if(token){
        const fechaInicio = this.dividirDechas(<string><unknown>this.rangeValue)[0]
        const fechaFinal = this.dividirDechas(<string><unknown>this.rangeValue)[1]
        const payload: TokenPayload = jwtDecode(token); 
        this.authService.getIdPerson(payload.sub).subscribe({
          next:(idUsuario)=>{
            this.reserva.fechaIncioReserva = fechaInicio
            this.reserva.fechaFinReserva = fechaFinal
            this.reservaHotelService.guardarReservaHabitacion(this.reserva,idUsuario,this.idHabitacion).subscribe({
              complete:()=>{
                this.limpiarFecha()
                this.cerrarModal()
                environment.mensajeToast('success','Reserva registrada',"La reserva se ha registrado, en breve te llegara un correo de confirmación")
                this.disabledDates = [];
                this.mailService.enviarCorreoAUsuario(idUsuario).subscribe((mensaje)=>{
                  console.log("Mensaje del servidor del correo "+mensaje)
                })
              },
              error:()=>{
                environment.mensajeToast('error','Lo sentimos algo salio mal','Hemos enviado el error a los responsables, lamentamos las molestias')
              }
            })
          }
      })
      }else{
        environment.mensajeToast('warning','No se ha completado la reserva','Por favor inicie sesion')
      }
    }catch{
    }
  }

  limpiarFecha(){
    this.rangeValue = { Desde: null, hasta: null };
  }

  
  abrirModal(): void {
    this.cargarFechas().then(() => {
      this.isVisible = true; // Abre el modal solo después de que las fechas estén cargadas
    }).catch(error => {
      console.error('Error al cargar las fechas:', error);
      // Opcional: Mostrar un mensaje al usuario
    });
  }
  
  cargarFechas(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.idHabitacion) {
        this.habitacionService.getHabitacionById(this.idHabitacion).subscribe({
          next: (auxhabitacion) => {
            this.habitacion = auxhabitacion;
            this.obtenerFechasReservadas(auxhabitacion.idHabitacion).then(() => {
              resolve(); // Resuelve la promesa cuando las fechas están listas
            }).catch(error => {
              reject(error); // Rechaza la promesa si ocurre un error al cargar las fechas
            });
          },
          error: (err) => {
            reject(err); // Rechaza la promesa si ocurre un error al obtener la habitación
          }
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
  
  formatearFecha(fecha: Date): string {
    const año = fecha.getFullYear();
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const día = fecha.getDate().toString().padStart(2, '0');
    return `${año}-${mes}-${día}`;
  }
  
  
}
