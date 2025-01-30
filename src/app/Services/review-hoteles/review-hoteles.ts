import { DatosPersona } from "../DatosPersonales/datosPersonales"
import { Hoteles } from "../hoteles/hoteles"

export interface ReviewHoteles{
    idReviewHotel:number
    fechaReview:Date
    contenido:string
    calificacion:number
    usuario:DatosPersona
    hoteles:Hoteles
}