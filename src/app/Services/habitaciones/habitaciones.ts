import { Hoteles } from "../hoteles/hoteles";

export class Habitaciones{
    idHabitacion:number;
    nombreHabitacion:string;
    descripcion:string;
    disponible:boolean;
    precio:number;
    hoteles:Hoteles
}