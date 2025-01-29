import { Restaurante } from "../restaurantes/restaurante";

export interface EtiquetaRestaurante {
    idEtiquetaRestaurante: number;
    etiqueta: string;
    restaurantes: Restaurante[];
}