import { DatosPersona } from "../DatosPersonales/datosPersonales";
import { Publicaciones } from "../publicaciones/publicaciones";

export interface Comentario{
    contenido:string;
    publicaciones:Publicaciones;
    usuario:DatosPersona;
    fechaComentario:Date;

    
}