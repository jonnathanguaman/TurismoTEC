import { ImagenesHoteles } from "../imagenesHoteles/imagesHoteles";

export interface Hoteles{
    idHotel:number;
    nombre:string;
    direccion:string;
    telefono:string;
    descripcion:string;
    calificacion:number;
    imagenesHoteles:ImagenesHoteles[];
}