import { DatosPersona } from "../DatosPersonales/datosPersonales"
import { Lugares } from "../Lugares/lugares"

export interface ReviewLugar{
    idReviewPlaces:number
    contenido:string
    calificacion:number
    usuario:DatosPersona
    lugares:Lugares
    fechaReview:Date
}