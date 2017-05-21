import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { ApplyFilterPipe } from './pipes/apply-filter.pipe';
import { EdadPipe } from './pipes/edad.pipe';
import { FechaPipe } from './pipes/fecha.pipe';

/*Helpers*/
import { AuthGuard } from './guards/authguard';
import { Helper } from './helpers/helper';
import { routing } from './app.routing';

/*Services*/
import { AutenticacionService } from './services/seguridad/autenticacion.service';
import { UsuariosService } from './services/seguridad/usuarios.service';
import { MenuesService } from './services/sistema/menues.service';
import { PerfilesService } from './services/seguridad/perfiles.service';
import { RutasService } from './services/seguridad/rutas.service';
import { PagerService } from './services/general/pager.service';
import { GestionService } from './services/modulos/archivos/gestion.service';
import { ConvencionService } from './services/modulos/archivos/convencion.service';
import { ArchivoService } from './services/modulos/archivos/archivo.service';


/*Componentes*/
import { IngresarComponent } from './components/sistema/ingresar/ingresar.component';
import { HomeComponent } from './components/general/home/home.component';
import { NavbarDefaultComponent } from './components/general/navbar-default/navbar-default.component';
import { NavbarTopComponent } from './components/general/navbar-top/navbar-top.component';
import { DashboardHeaderComponent } from './components/general/dashboard-header/dashboard-header.component';
import { FooterComponent } from './components/general/footer/footer.component';
import { SmallChatComponent } from './components/general/small-chat/small-chat.component';
import { NavbarRightComponent } from './components/general/navbar-right/navbar-right.component';
import { EnConstruccionComponent } from './components/general/en-construccion/en-construccion.component';
import { UsuariosComponent } from './components/sistema/usuarios/usuarios.component';
import { PerfilesComponent } from './components/sistema/usuarios/perfiles/perfiles.component';
import { PerfilAddComponent } from './components/sistema/usuarios/perfiles/perfil-add/perfil-add.component';
import { PerfilEditComponent } from './components/sistema/usuarios/perfiles/perfil-edit/perfil-edit.component';
import { PerfilViewComponent } from './components/sistema/usuarios/perfiles/perfil-view/perfil-view.component';
import { UsuarioAddComponent } from './components/sistema/usuarios/usuario-add/usuario-add.component';
import { UsuarioEditComponent } from './components/sistema/usuarios/usuario-edit/usuario-edit.component';
import { MenuesComponent } from './components/sistema/menues/menues.component';
import { ArchivosComponent } from './components/modulos/archivos/archivos.component';
import { ArchivoAddComponent } from './components/modulos/archivos/archivo-add/archivo-add.component';
import { GestionComponent } from './components/modulos/archivos/gestion/gestion.component';
import { ConvencionComponent } from './components/modulos/archivos/convencion/convencion.component';
import { CapitalizePipe } from './pipes/capitalize.pipe';



@NgModule({
  declarations: [
    AppComponent,
    ApplyFilterPipe,
    EdadPipe,
    FechaPipe,
    IngresarComponent,
    HomeComponent,
    NavbarDefaultComponent,
    NavbarTopComponent,
    DashboardHeaderComponent,
    FooterComponent,
    SmallChatComponent,
    NavbarRightComponent,
    EnConstruccionComponent,
    UsuariosComponent,
    PerfilesComponent,
    PerfilAddComponent,
    PerfilEditComponent,
    PerfilViewComponent,
    UsuarioAddComponent,
    UsuarioEditComponent,
    MenuesComponent,
    ArchivosComponent,
    ArchivoAddComponent,
    GestionComponent,
    ConvencionComponent,
    CapitalizePipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    routing
  ],
  providers: [
    Helper, AutenticacionService, UsuariosService, AuthGuard, MenuesService, AppComponent,
    NavbarDefaultComponent, PerfilesService, RutasService, PagerService, GestionService,
    ConvencionService, ArchivoService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
