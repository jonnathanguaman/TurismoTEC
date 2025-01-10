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
import { TiendaComponent } from './Pages/tienda/tienda.component';
import { ProductoComponent } from './Pages/producto/producto.component';

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
    TiendaComponent,
    ProductoComponent,
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
