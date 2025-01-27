import { Component, Input, OnInit } from '@angular/core';
import { HabitacionesService } from '../../Services/habitaciones/habitaciones.service';
import { Habitaciones } from '../../Services/habitaciones/habitaciones';
import { DisableEnableDate } from 'angularx-flatpickr/lib/flatpickr-defaults.service';
import { Data } from '@angular/router';
import { ReservaHotelService } from '../../Services/registrarReservaHabitacion/reserva-hotel.service';
import { ReservaHatitacion } from '../../Services/registrarReservaHabitacion/reservaHotel';
import { environment } from '../../../enviroments/enviroment';
import { AuthRegisterService } from '../../Services/auth/authRegister.service';
import { jwtDecode } from 'jwt-decode';
import { TokenPayload } from '../../Services/DatosPersonales/TokenPayload ';
@Component({
  selector: 'app-modal-habitacion',
  templateUrl: './modal-habitacion.component.html',
  styleUrl: './modal-habitacion.component.css',
})
export class ModalHabitacionComponent implements OnInit{

  constructor(
    private habitacionService:HabitacionesService,
    private reservaHotelService:ReservaHotelService,
    private authService: AuthRegisterService,){}
  selectedDate:string = ''

  @Input() idHabitacion?:number

  fechaActual:string =<string> <unknown>new Date()

  disabledDates = ['2025-01-01', '2025-01-10', '2025-02-14'];
  rangeValue: { Desde: Date; hasta: Date } = {
    Desde: null,
    hasta: null
  };



  habitacion!:Habitaciones
  isVisible: boolean = false;

  abrirModal(): void {
    this.isVisible = true;
    if(this.idHabitacion){
      this.habitacionService.getHabitacionById(this.idHabitacion).subscribe(auxhabitacion =>{
        this.habitacion = auxhabitacion
      })
    }

  }

  cerrarModal(): void {
    this.isVisible = false;
  }
  
  ngOnInit(): void {
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
                environment.mensajeToast('success','Reserva registrada',"La reserva se ha registrado, puede verla en su perfil")
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
}
