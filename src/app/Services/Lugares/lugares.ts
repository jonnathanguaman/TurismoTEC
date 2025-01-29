import { DatosPersona } from "../DatosPersonales/datosPersonales";
import { ImagenesLugares } from "../ImagenesLugares/imagenesLugares";

export interface Lugares{
    idLugares:number;
    nombre:string;
    descripcion:string;
    direccion:string;
    tipoZona:string;
    areaProtegida:boolean;
    patrimonio:boolean;
    latitud:number,
    longitud:number,
    imagenesLugars:ImagenesLugares[]
    usuario:DatosPersona
    // True publico
    // False privado
    visualizacion:boolean

    aprobado:boolean
    // True admin
    // False user
    creadoPor:boolean
}