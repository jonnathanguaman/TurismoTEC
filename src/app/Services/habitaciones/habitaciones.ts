import { Hoteles } from "../hoteles/hoteles";
import { ImagenesHabitacion } from "../imagenesHabitaciones/imagenesHabitacion";

export class Habitaciones{
    idHabitacion:number;
    nombreHabitacion:string;
    descripcion:string;
    disponible:boolean;
    precio:number;
    hoteles:Hoteles
    imagenesHabitaciones:ImagenesHabitacion[]
}