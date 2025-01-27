import { Hoteles } from "../hoteles/hoteles";

export interface Habitaciones{
    idHabitacion:number;
    nombreHabitacion:string;
    descripcion:string;
    disponible:boolean;
    precio:number;
    numeroHabitacion:number;
    hoteles:Hoteles
}