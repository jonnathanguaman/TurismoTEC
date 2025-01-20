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
import { MenuRestauranteComponent } from './Components/menu-restaurante/menu-restaurante.component'; 

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
    MenuRestauranteComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [
    {provide:HTTP_INTERCEPTORS,useClass:JwtInterceptorService,multi:true},
    {provide:HTTP_INTERCEPTORS, useClass:ErrorInterceptorService,multi:true},
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
