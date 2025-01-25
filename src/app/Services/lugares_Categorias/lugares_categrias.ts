import { EtiquetasLugar } from "../categoriasLugares/categoriaLugar"
import { Lugares } from "../Lugares/lugares"

export interface Lugares_categoria{
    idLugaresCategoria:number
    etiquetas:EtiquetasLugar
    lugares:Lugares
}