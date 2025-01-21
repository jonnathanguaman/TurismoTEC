import { ImagenesRestaurantes } from "../imagenesRestaurantes/imagenesRestaurantes";

export interface Restaurante{
    idRestaurante:number;
    nombre:string;
    direccion:string;
    telefono:string;
    descripcion:string;
    menu:string;
    calificacion:number
    imagenesRestaurantes:ImagenesRestaurantes[]
}