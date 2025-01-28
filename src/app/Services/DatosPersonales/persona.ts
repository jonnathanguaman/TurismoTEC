import { Auth } from "../login/Auth";

export interface Persona{
    id_Usuario:number;
    nombre:string;
    apellido:string;
    edad:number;
    paisOrigen:string;
    idioma:string;
    correo:string
    auth:Auth
}