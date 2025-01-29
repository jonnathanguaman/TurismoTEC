import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistroPersonaComponent } from './Pages/registro-persona/registro-persona.component';
import { InicioComponent } from './Pages/inicio/inicio.component';
import { NosotrosComponent } from './Pages/nosotros/nosotros.component';
import { PerfilComponent } from './Pages/perfil/perfil.component';
import { RecomendacionesComponent } from './Pages/recomendaciones/recomendaciones.component';
import { LoginComponent } from './Pages/login/login.component';
import { LugarComponent } from './Pages/lugar/lugar.component';
import { VerHotelesComponent } from './Pages/ver-hoteles/ver-hoteles.component';
import { HabitacionesComponent } from './Pages/habitaciones/habitaciones.component';
import { ForoComponent } from './Pages/foro/foro.component';
import { VerRestaurantesComponent } from './Pages/ver-restaurantes/ver-restaurantes.component';
import { MesasComponent } from './Pages/mesas/mesas.component';
import { CrudLugarComponent } from './Components/crud-lugar/crud-lugar.component';
import { CrudRestauranteComponent } from './Components/crud-restaurante/crud-restaurante.component';
import { CrudHotelComponent } from './Components/crud-hotel/crud-hotel.component';
import { PaginaAdminComponent } from './Pages/pagina-admin/pagina-admin.component';
import { CrubEtiquetaLugarComponent } from './Components/crub-etiqueta-lugar/crub-etiqueta-lugar.component';
import { ReviewComponent } from './Components/review/review.component';
import { CrudReservasHabitacionComponent } from './Components/crud-reservas-habitacion/crud-reservas-habitacion.component';
import { CrudPersonasComponent } from './Components/crud-personas/crud-personas.component';
import { CrubEtiquetaHotelComponent } from './Components/crub-etiqueta-hotel/crub-etiqueta-hotel.component';
import { CrudEtiquetaRestauranteComponent } from './Components/crud-etiqueta-restaurante/crud-etiqueta-restaurante.component';

const routes: Routes = [
  {
    path: "registro",
    component: RegistroPersonaComponent
  },
  {
    path: "",
    component: InicioComponent
  },
  {
    path: "nosotros",
    component: NosotrosComponent
  },
  {
    path: "perfil",
    component: PerfilComponent
  },
  {
    path: "recomendaciones",
    component: RecomendacionesComponent
  },
  {
    path: "login",
    component: LoginComponent
  },
  {
    path: "lugar",
    component: LugarComponent
  },
  {
    path: "lugar/:id",
    component: LugarComponent
  },
  {
    path: "hoteles",
    component: VerHotelesComponent
  },
  {
    path: "habitacion/:id",
    component: HabitacionesComponent
  },
  {
    path: "foro",
    component: ForoComponent
  },
  {
    path: "restaurantes",
    component: VerRestaurantesComponent
  },
  {
    path: "restaurantes",
    component: VerRestaurantesComponent
  },
  {
    path: "mesa/:id",
    component: MesasComponent
  },
  {
    path: "review",
    component: ReviewComponent
  },
  {
    path: "admin",
    component: PaginaAdminComponent,
    children: [
      {
        path: "crud-reservaciones-habitaciones",
        component: CrudReservasHabitacionComponent
      },
      {
        path: "crudRestaurante",
        component: CrudRestauranteComponent
      },
      {
        path: "crudLugar",
        component: CrudLugarComponent
      },
      {
        path: "crudHotel",
        component: CrudHotelComponent
      },
      {
        path: "crudPersonas",
        component: CrudPersonasComponent
      },
      {
        path: "crudEtiquetaLugar",
        component: CrubEtiquetaLugarComponent,
        children: [
          {
            path: ":id",
            component: CrubEtiquetaLugarComponent
          }
        ]
      }, {
        path: "crudEtiquetaHotel",
        component: CrubEtiquetaHotelComponent,
        children: [
          {
            path: ":id",
            component: CrubEtiquetaHotelComponent
          }
        ]
      }, {
        path: "crudEtiquetaRestaurante",
        component: CrudEtiquetaRestauranteComponent,
        children: [
          {
            path: ":id",
            component: CrudEtiquetaRestauranteComponent
          }
        ]
      },
    ]
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
