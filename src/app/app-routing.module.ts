import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistroPersonaComponent } from './Pages/registro-persona/registro-persona.component';
import { InicioComponent } from './Pages/inicio/inicio.component';
import { NosotrosComponent } from './Pages/nosotros/nosotros.component';
import { PerfilComponent } from './Pages/perfil/perfil.component';
import { RecomendacionesComponent } from './Pages/recomendaciones/recomendaciones.component';
import { LoginComponent } from './Pages/login/login.component';
import { DatosPersonalesComponent } from './Components/datos-personales/datos-personales.component';
import { TiendaComponent } from './Pages/tienda/tienda.component';
import { ProductoComponent } from './Pages/producto/producto.component';

const routes: Routes = [
  {
    path:"registro",
    component:RegistroPersonaComponent
  },
  {
    path:"",
    component:InicioComponent
  },
  {
    path:"nosotros",
    component:NosotrosComponent
  },
  {
    path:"perfil",
    component:PerfilComponent
  },
  {
    path:"recomendaciones",
    component:RecomendacionesComponent
  },
  {
    path:"login",
    component:LoginComponent
  },
  {
    path:"tienda",
    component:TiendaComponent
  },
  {
    path:"producto",
    component:ProductoComponent
  }
 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
