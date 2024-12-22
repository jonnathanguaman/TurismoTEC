import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
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
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [
    provideClientHydration()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
