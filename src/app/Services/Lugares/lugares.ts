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
}