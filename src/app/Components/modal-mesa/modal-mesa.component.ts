import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { MesasService } from '../../Services/mesas/mesas.service';
import { Mesa } from '../../Services/mesas/mesas';
import { ReservaMesa } from '../../Services/registrarReservaMesa/reserva-mesa';
import { ReservaMesaService } from '../../Services/registrarReservaMesa/reserva-mesa.service';
import { environment } from '../../../enviroments/enviroment';
import { AuthRegisterService } from '../../Services/auth/authRegister.service';
import { TokenPayload } from '../../Services/DatosPersonales/TokenPayload ';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-modal-mesa',
  templateUrl: './modal-mesa.component.html',
  styleUrls: ['./modal-mesa.component.css']
})
export class ModalMesaComponent implements OnChanges{

  @Input() idMesa!:number

  fechaActual:string =<string> <unknown>new Date()
  disabledDates = [''];
  isVisible: boolean = false;
  mesaObtenda:Mesa
  horarioOpen = false

  horarios: string[] = [];
  horaAsignada:string[] = [];
  horaReservada:string

  fechaSelecionada:Date

  abrirModal(): void {
    this.isVisible = true;
    console.log(this.idMesa)
  }

  cerrarModal(): void {
    this.limpiarDatos()
    this.isVisible = false;
  }

  openModalHorario(){
    if(this.fechaSelecionada){
      this.horarioOpen = true
      this.horarios =[]
      this.horaAsignada = []
      this.obtenerHorasOcupadasByMesaAndFecha().then(()=>{
        this.generarHorarios();
      })
      
    }else{
      environment.mensajeToast('warning', 'Por favor, seleccione una fecha', 'Es necesario elegir una fecha antes de continuar.');
    }
  }

  closeModalHorario(){
    this.horarioOpen = false
  }

  generarHorarios() {
    let start = 10;
    while (start < 20) {
      const horario = `${this.pad(start)}:00 - ${this.pad(start + 1)}:00`;
      // Verificamos si 'horario' ya está en 'this.horaAsignada'
      if (!this.horaAsignada.includes(horario)) {
        this.horarios.push(horario); // Añadir al array de horarios disponibles
      }
      start += 1; // Incrementamos start solo una vez por ciclo
    }
  }
  

  pad(num: number): string {
    return num.toString().padStart(2, '0');
  }

  constructor(
    private readonly mesaService:MesasService,
    private readonly reservaMesaService:ReservaMesaService,
    private authService:AuthRegisterService,
  ){}


  ngOnChanges(): void {
    this.obtenerMesa()
  }

  seleccionarHorario(horario: string) {
    this.horaReservada = horario
    this.closeModalHorario()
  }

  obtenerMesa(){
    this.mesaService.getMesaById(this.idMesa).subscribe({
      next:(mesa)=>{
        this.mesaObtenda = mesa
      }
    })
  }

  public reserva:ReservaMesa = new ReservaMesa();
  generarReserva(){
    const token = sessionStorage.getItem('token')
      if(token){

        environment.mensajeEmergente("Confirmación de reserva", "¿Está seguro de que desea confirmar la reserva?", "warning").then(
          (confirmar)=>{
            if(confirmar){
              const payload: TokenPayload = jwtDecode(token); 
              this.reserva.horaReserva = this.horaReservada
      
              let fechaSeleccionada = new Date(this.fechaSelecionada); // Fecha seleccionada
              this.reserva.fechaReserva = new Date(fechaSeleccionada.setDate(fechaSeleccionada.getDate() + 1))
      
              this.authService.getIdPerson(payload.sub).subscribe({
                next:(idUser)=>{
                  this.reservaMesaService.registarReserva(this.reserva,idUser,this.idMesa).subscribe({
                    complete:()=>{
                      environment.mensajeToast('success','Reserva registrada','Se ha registrado la reserva')
                      this.cerrarModal()
                    },
                    error:()=>{
                      environment.mensajeToast('error','Se ha producido un error','Pedimos disculpas por los inconvenientes.')
                    }
                  })
                }
              })
            }else{
              environment.mensajeToast('success', 'La reserva no se completó', '');
            }
          });
      }else{
        environment.mensajeToast('warning', 'No se pudo completar la reserva', 'Por favor, inicia sesión para continuar.');
      }
  }

  limpiarDatos(){
    this.horaReservada = ""
    this.fechaSelecionada = null
  }


  obtenerHorasOcupadasByMesaAndFecha(): Promise<void> {
    return new Promise((resolve, reject) => {
      let fechaSeleccionada = new Date(this.fechaSelecionada); // Fecha seleccionada
      let fechaEnviar = new Date(fechaSeleccionada.setDate(fechaSeleccionada.getDate() + 1)); // Sumamos un día
  
      this.reservaMesaService.obtenerHorasOcupadasByMesaAndFecha(
        this.formatearFecha(fechaEnviar),
        this.idMesa
      ).subscribe({
        next: (horas) => {
          console.log(horas);
          horas.forEach((hora) => {
            this.horaAsignada.push(hora);
          });
          resolve();  // Resolución de la promesa
        },
        error: (e) => {
          console.error(e);
          reject(e);  // Rechazo de la promesa en caso de error
        }
      });
    });
  }
  

  formatearFecha(fecha: Date): string {
    const pad = (num: number, size: number = 2) => ('0'.repeat(size) + num).slice(-size);
    return `${fecha.getFullYear()}-${pad(fecha.getMonth() + 1)}-${pad(fecha.getDate())} ` +
           `${pad(fecha.getHours())}:${pad(fecha.getMinutes())}:${pad(fecha.getSeconds())}.` +
           `${pad(fecha.getMilliseconds(), 3)}`;  
  }
}
