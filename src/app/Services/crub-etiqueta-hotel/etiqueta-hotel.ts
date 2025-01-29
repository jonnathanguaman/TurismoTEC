import { Hoteles } from "../hoteles/hoteles";

export interface EtiquetaHotel {
    idEtiquetaHoteles: number;
    etiqueta: string;
    hoteles: Hoteles[];
}