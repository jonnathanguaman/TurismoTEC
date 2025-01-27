import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EncuestaComponent } from './Components/encuesta/encuesta.component';
import { RegistroPersonaComponent } from './Pages/registro-persona/registro-persona.component';
import { MenuComponent } from './Shared/menu/menu.component';
import { FooterComponent } from './Shared/footer/footer.component';
import { InicioComponent } from './Pages/inicio/inicio.component';
import { PerfilComponent } from './Pages/perfil/perfil.component';
import { NosotrosComponent } from './Pages/nosotros/nosotros.component';
import { RecomendacionesComponent } from './Pages/recomendaciones/recomendaciones.component';
import { SliderInicioComponent } from './Components/slider-inicio/slider-inicio.component';
import { LoginComponent } from './Pages/login/login.component';
import { DatosPersonalesComponent } from './Components/datos-personales/datos-personales.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { JwtInterceptorService } from './Services/login/jwt-interceptor.service';
import { ErrorInterceptorService } from './Services/login/error-interceptor.service';
import { VerHotelesComponent } from './Pages/ver-hoteles/ver-hoteles.component';
import { LugarComponent } from './Pages/lugar/lugar.component';
import { HabitacionesComponent } from './Pages/habitaciones/habitaciones.component';
import { SliderHotelComponent } from './Components/slider-hotel/slider-hotel.component';
import { ModalHabitacionComponent } from './Components/modal-habitacion/modal-habitacion.component';
import { ForoComponent } from './Pages/foro/foro.component';
import { VerRestaurantesComponent } from './Pages/ver-restaurantes/ver-restaurantes.component';
import { MesasComponent } from './Pages/mesas/mesas.component';
import { SliderRestauranteComponent } from './Components/slider-restaurante/slider-restaurante.component';
import { ModalMesaComponent } from './Components/modal-mesa/modal-mesa.component';
import { CrudLugarComponent } from './Components/crud-lugar/crud-lugar.component';
import { CrudRestauranteComponent } from './Components/crud-restaurante/crud-restaurante.component';
import { CrudHotelComponent } from './Components/crud-hotel/crud-hotel.component'; 
import { MenuRestauranteComponent } from './Components/menu-restaurante/menu-restaurante.component';
import { TimeAgoPipe } from './Services/publicaciones/time-ago.pipe';
import { PaginaAdminComponent } from './Pages/pagina-admin/pagina-admin.component';
import { MenuAdminComponent } from './Shared/menu-admin/menu-admin.component';
import { CrubEtiquetaLugarComponent } from './Components/crub-etiqueta-lugar/crub-etiqueta-lugar.component';
import { CrubEtiquetaHotelComponent } from './Components/crub-etiqueta-hotel/crub-etiqueta-hotel.component'; 
import { FlatpickrDirective, provideFlatpickrDefaults } from 'angularx-flatpickr';
import { CrubReservacionesHabitacionesComponent } from './Components/crub-reservaciones-habitaciones/crub-reservaciones-habitaciones.component';
import { ReviewComponent } from './Components/review/review.component'; 

@NgModule({
  declarations: [
    AppComponent,
    EncuestaComponent,
    RegistroPersonaComponent,
    MenuComponent,
    FooterComponent,
    InicioComponent,
    PerfilComponent,
    NosotrosComponent,
    RecomendacionesComponent,
    SliderInicioComponent,
    LoginComponent,
    DatosPersonalesComponent,
    VerHotelesComponent,
    LugarComponent,
    HabitacionesComponent,
    SliderHotelComponent,
    ModalHabitacionComponent,
    ForoComponent,
    VerRestaurantesComponent,
    MesasComponent,
    SliderRestauranteComponent,
    ModalMesaComponent,
    CrudLugarComponent,
    CrudRestauranteComponent,
    CrudHotelComponent,
    MenuRestauranteComponent,
    TimeAgoPipe,
    PaginaAdminComponent,
    MenuAdminComponent,
    CrubEtiquetaLugarComponent,
    CrubEtiquetaHotelComponent,
    CrubReservacionesHabitacionesComponent,
    ReviewComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    FlatpickrDirective
  ],
  providers: [
    {provide:HTTP_INTERCEPTORS,useClass:JwtInterceptorService,multi:true},
    {provide:HTTP_INTERCEPTORS, useClass:ErrorInterceptorService,multi:true},
    provideFlatpickrDefaults()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
