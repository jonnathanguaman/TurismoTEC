import { Component, OnInit } from '@angular/core';
import { ReservaMesaService } from '../../Services/registrarReservaMesa/reserva-mesa.service';
import { ReservaMesa } from '../../Services/registrarReservaMesa/reserva-mesa';
import { environment } from '../../../enviroments/enviroment';
import { TokenPayload } from '../../Services/DatosPersonales/TokenPayload ';
import { jwtDecode } from 'jwt-decode';
import { AuthRegisterService } from '../../Services/auth/authRegister.service';
import { AuthService } from '../../Services/login/login.service';

@Component({
  selector: 'app-crud-reservas-mesas',
  templateUrl: './crud-reservas-mesas.component.html',
  styleUrl: './crud-reservas-mesas.component.css'
})
export class CrudReservasMesasComponent implements OnInit{

  constructor(
    private readonly reservasMesasService:ReservaMesaService,
    private readonly authService:AuthRegisterService,
    private readonly loginService:AuthService,
  ){}

  admin:boolean = false
  fechaActual:string =<string> <unknown>new Date()
  disabledDates = [''];
  horaReservada:string
  fechaSelecionada:Date
  isCrudModalOpen = false;
  horarioOpen = false
  horarios: string[] = [];
  horaAsignada:string[] = [];
  idMesa:number

  todasReservasMesas:ReservaMesa[]

  ngOnInit(): void {
    this.loginService.getRoles()
    this.loginService.admin.subscribe({
      next:(admin)=>{
        this.admin = admin
      }
    })

    if(this.admin){
      this.obtenerReservasMesas()
    }else if(!this.admin){
      this.obtenerReservasMesasByIdUsuario()
    }
    
  }

 

    obtenerReservasMesas(){
      console.log("Entro aqui")
      this.reservasMesasService.obtenerTodasLasReservasMesas().subscribe({
        next:(reservasMesas)=>{
          this.todasReservasMesas = reservasMesas
        }
      })
    }

  obtenerReservasMesasByIdUsuario(){
    console.log("Entro aqui")
    const token = sessionStorage.getItem('token');
    const payload: TokenPayload = jwtDecode(token);
    this.authService.getIdPerson(payload.sub).subscribe({
      next:(idPersona)=>{
        console.log(idPersona)
        this.reservasMesasService.obtenerReservasByIdUser(idPersona).subscribe({
          next:(reservasUser)=>{
            console.log(reservasUser)
            this.todasReservasMesas = reservasUser
          }
        })
      }})
  }

  closeCrudModal() {
    this.limpiarDatos()
    this.isCrudModalOpen = false;
  }
  openCrudModal(idMesa:number){
    this.isCrudModalOpen = true;
    this.idMesa = idMesa
  }
  closeModalHorario(){
    this.horarioOpen = false
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

    
    obtenerHorasOcupadasByMesaAndFecha(): Promise<void> {
      return new Promise((resolve, reject) => {
        let fechaSeleccionada = new Date(this.fechaSelecionada); // Fecha seleccionada
        let fechaEnviar = new Date(fechaSeleccionada.setDate(fechaSeleccionada.getDate() + 1)); // Sumamos un día
    
        this.reservasMesasService.obtenerHorasOcupadasByMesaAndFecha(
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
    pad(num: number): string {
      return num.toString().padStart(2, '0');
    }

    seleccionarHorario(horario: string) {
      this.horaReservada = horario
      this.closeModalHorario()
    }

    


    reservaMesa:ReservaMesa
    //Reservas
    obtenerReserva(idReserva:number){
      this.reservasMesasService.obtenerReservaById(idReserva).subscribe({
        next:(reserva)=>{
          this.reservaMesa = reserva 
          console.log(this.reservaMesa)
        }
      })
    }

    modificarReserva(){
      const token = sessionStorage.getItem('token')
      if(token){
        const payload: TokenPayload = jwtDecode(token); 
        this.authService.getIdPerson(payload.sub).subscribe({
          next:(idUser)=>{
            this.reservaMesa.horaReserva = this.horaReservada
            let fechaSeleccionada = new Date(this.fechaSelecionada); // Fecha seleccionada
            this.reservaMesa.fechaReserva = new Date(fechaSeleccionada.setDate(fechaSeleccionada.getDate() + 1))
            this.reservasMesasService.registarReserva(this.reservaMesa,idUser,this.idMesa).subscribe({
              complete:()=>{
                this.disabledDates = [];
                this.closeCrudModal()
                environment.mensajeToast('success','Reserva modificada','La reserva se modifico con exito.')
              }
            })
          }})
      }
    }

    limpiarDatos(){
      this.horaReservada = ""
      this.fechaSelecionada = null
    }
  }
