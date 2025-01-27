import { DatosPersona } from "../DatosPersonales/datosPersonales";
import { Habitaciones } from "../habitaciones/habitaciones";

export class ReservaHatitacion{
    idReservas:number;
    fechaIncioReserva:Date;
    fechaFinReserva:Date;
    habitaciones:Habitaciones;
    usuario:DatosPersona;
}