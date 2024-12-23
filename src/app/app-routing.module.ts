import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistroPersonaComponent } from './Pages/registro-persona/registro-persona.component';
import { InicioComponent } from './Pages/inicio/inicio.component';
import { NosotrosComponent } from './Pages/nosotros/nosotros.component';
import { PerfilComponent } from './Pages/perfil/perfil.component';
import { RecomendacionesComponent } from './Pages/recomendaciones/recomendaciones.component';
import { LoginComponent } from './Pages/login/login.component';

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
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
