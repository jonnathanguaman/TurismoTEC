import { DatosPersona } from "../DatosPersonales/datosPersonales";
import { ImagenesHoteles } from "../imagenesHoteles/imagesHoteles";
import { Lugares } from "../Lugares/lugares";

export interface Hoteles{
    idHotel:number;
    nombre:string;
    direccion:string;
    telefono:string;
    descripcion:string;
    imagenesHoteles:ImagenesHoteles[];
    usuario:DatosPersona;
    lugar:Lugares;
}