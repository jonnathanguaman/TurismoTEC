import { DatosPersona } from "../DatosPersonales/datosPersonales"
import { Mesa } from "../mesas/mesas"

export class ReservaMesa{
    idReservaMesa:number
    fechaReserva:Date
    horaReserva:string
    estadoReserva:boolean
    mesas:Mesa
    usuario:DatosPersona
}