import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/general/home/home.component';
import { IngresarComponent } from './components/sistema/ingresar/ingresar.component'
import { EnConstruccionComponent } from './components/general/en-construccion/en-construccion.component';
import { UsuariosComponent } from './components/sistema/usuarios/usuarios.component';
import { UsuarioEditComponent } from './components/sistema/usuarios/usuario-edit/usuario-edit.component';
import { UsuarioAddComponent } from './components/sistema/usuarios/usuario-add/usuario-add.component';
import { UsuarioViewComponent } from './components/sistema/usuarios/usuario-view/usuario-view.component';
import { PerfilesComponent } from './components/sistema/usuarios/perfiles/perfiles.component';
import { PerfilAddComponent } from './components/sistema/usuarios/perfiles/perfil-add/perfil-add.component';
import { PerfilEditComponent } from './components/sistema/usuarios/perfiles/perfil-edit/perfil-edit.component';
import { PerfilViewComponent } from './components/sistema/usuarios/perfiles/perfil-view/perfil-view.component';
import { MenuesComponent } from './components/sistema/menues/menues.component';
import { ArchivosComponent } from './components/modulos/archivos/archivos.component';
import { ArchivoAddComponent } from './components/modulos/archivos/archivo-add/archivo-add.component';
import { ArchivoViewComponent } from './components/modulos/archivos/archivo-view/archivo-view.component';
import { GestionComponent } from './components/modulos/archivos/gestion/gestion.component';
import { ConvencionComponent } from './components/modulos/archivos/convencion/convencion.component';

import { AuthGuard } from './guards/authguard';
const appRoutes: Routes = [
     { path:'', redirectTo:'home', pathMatch:'full' }
    ,{ path:'ingresar', component:IngresarComponent }
    ,{ path:'salir', component:IngresarComponent }
    ,{ path:'home', component:HomeComponent, canActivate:[AuthGuard] }
    ,{ path:'enconstruccion', component:EnConstruccionComponent }
    ,{ path:'perfiles', component:PerfilesComponent, canActivate:[AuthGuard] }
    ,{ path:'perfiledit/:perfilid', component:PerfilEditComponent, canActivate:[AuthGuard] }
    ,{ path:'perfiladd', component:EnConstruccionComponent, canActivate:[AuthGuard] }
    ,{ path:'perfil/:perfilid', component:PerfilViewComponent, canActivate:[AuthGuard] }
    ,{ path:'usuarios', component:UsuariosComponent, canActivate:[AuthGuard] }
    ,{ path:'usuarioedit/:usuario', component:UsuarioEditComponent, canActivate:[AuthGuard] }
    ,{ path:'usuarioadd', component:UsuarioAddComponent, canActivate:[AuthGuard] }
    ,{ path:'usuarioview/:usuario', component:UsuarioViewComponent }
    ,{ path:'menues', component:MenuesComponent, canActivate:[AuthGuard] }
    ,{ path:'archivos', component:ArchivosComponent }
    ,{ path:'archivoadd', component:ArchivoAddComponent }
    ,{ path:'archivoview/:archivoid', component:ArchivoViewComponent }
    ,{ path:'gestion', component:GestionComponent }
    ,{ path:'convencion', component:ConvencionComponent }

    ,{ path: '**', redirectTo: 'home' }

];

export const routing = RouterModule.forRoot(appRoutes);
