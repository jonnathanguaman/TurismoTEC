import { Comentario } from "../comentario/comentario";
import { DatosPersona } from "../DatosPersonales/datosPersonales";

export interface Publicaciones{
    idPublicaciones:number;
    titulo:string;
    contenido:string;
    fechaPublicacion:Date
    usuario:DatosPersona;

    //Controlar comentarios por publicación
    mostrarComentarios?: boolean;
    mostrandoFormulario?: boolean; 
    comentarios?: Comentario[];
    textComentario?: string;
}