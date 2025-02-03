import { EtiquetaHotel } from "../crub-etiqueta-hotel/etiqueta-hotel";
import { DatosPersona } from "../DatosPersonales/datosPersonales";
import { ImagenesHoteles } from "../imagenesHoteles/imagesHoteles";
import { Lugares } from "../Lugares/lugares";

export class Hoteles{
    idHotel:number;
    nombre:string;
    direccion:string;
    telefono:string;
    descripcion:string;
    imagenesHoteles:ImagenesHoteles[];
    usuario:DatosPersona;
    lugar:Lugares;
    etiquetasHoteles:EtiquetaHotel[];
}