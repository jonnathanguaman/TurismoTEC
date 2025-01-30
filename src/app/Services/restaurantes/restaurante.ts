import { DatosPersona } from "../DatosPersonales/datosPersonales";
import { ImagenesRestaurantes } from "../imagenesRestaurantes/imagenesRestaurantes";
import { Lugares } from "../Lugares/lugares";

export interface Restaurante {
    idRestaurante: number;
    nombre: string;
    direccion: string;
    telefono: string;
    descripcion: string;
    menu: string;
    //calificacion:number
    imagenesRestaurantes: ImagenesRestaurantes[]
    usuario: DatosPersona;
    lugar: Lugares;
}