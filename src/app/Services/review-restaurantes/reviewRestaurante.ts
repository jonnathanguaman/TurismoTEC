import { DatosPersona } from "../DatosPersonales/datosPersonales"
import { Restaurante } from "../restaurantes/restaurante"

export interface ReviewRestaurante{
    idReviewRestaurante:number
    fechaReview:Date
    contenido:string
    calificacion:number
    usuario:DatosPersona
    restaurante:Restaurante
}