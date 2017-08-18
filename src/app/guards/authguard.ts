import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AutenticacionService } from 'app/services/seguridad/autenticacion.service';
import { app } from '../../environments/environment';
import { AppComponent } from '../app.component';
import { NavbarDefaultComponent } from '../components/general/navbar-default/navbar-default.component';
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private _router: Router,
    private _auth: AutenticacionService,
    private _parent: AppComponent,
    private barra: NavbarDefaultComponent) { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    // console.log("route-access",state);

    let _url = '';
    state.url.split('/').forEach(element => {
      if (_url === '') {
        if (element !== '') {
          _url = element;
        }
      }
    });

    // console.log("AuthGuard:");
    // console.log(_url);
    // console.log(this._auth.usuario);

    if (!localStorage.getItem(app.currentuser)) {
      if (_url !== 'ingresar' && _url !== 'salir') {
        this._router.navigate(['/ingresar']);
        return Observable.of(false);
      }
    }

    return this._auth.check(_url)
      .map((result) => {
        if (result) {
          return true;
        } else {
          // this._router.navigate(['/ingresar']);
          return false;
        }
      });
    // return Observable.of(true);
  }

}
