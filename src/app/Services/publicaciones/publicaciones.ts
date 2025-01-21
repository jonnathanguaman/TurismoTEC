import { DatosPersona } from "../DatosPersonales/datosPersonales";

export interface Publicaciones{
    idPublicaciones:number;
    titulo:string;
    contenido:string;
    fechaPublicacion:Date
    usuario:DatosPersona;
}