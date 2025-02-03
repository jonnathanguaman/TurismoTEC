import { EtiquetaRestaurante } from "../crud-etiqueta-restaurante/etiqueta-Restaurante";
import { DatosPersona } from "../DatosPersonales/datosPersonales";
import { ImagenesRestaurantes } from "../imagenesRestaurantes/imagenesRestaurantes";
import { Lugares } from "../Lugares/lugares";

export class Restaurante {
    idRestaurante: number;
    nombre: string;
    direccion: string;
    telefono: string;
    descripcion: string;
    menu: string;
    imagenesRestaurantes: ImagenesRestaurantes[]
    usuario: DatosPersona;
    lugar: Lugares;
    etiquetasRestaurante: EtiquetaRestaurante[];
}