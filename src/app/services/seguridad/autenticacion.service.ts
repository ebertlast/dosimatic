import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import { Helper } from 'app/helpers/helper';
import { Router } from '@angular/router';
import { app, environment } from '../../../environments/environment';
import { Usuario } from 'app/models/usuario';
@Injectable()
export class AutenticacionService {
  public token: string;
  public usuario:Usuario;
  constructor(private _http: Http,private _helper:Helper, private _router:Router) {
    this.usuario=new Usuario();
    if(localStorage.getItem(app.currentuser)){
      var currentUser = JSON.parse(localStorage.getItem(app.currentuser))["usuario"];
      // console.log("Usuario en Autenticacion Service:");
      // console.log(currentUser);
      this.usuario=currentUser;
    }
    // console.log("Token:"+this.usuario.token);
    this.token = this.usuario.token;
  }
  public handleError (error: Response | any) {
    let errMsg: string;
    let errorCode: number;
    if (!environment.production){
      console.log('Entro a HandleError');
    }
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
      errorCode = +error.status;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }

    if (!environment.production) {
      console.log('[autenticacion.service.ts](handleError) Error Arrojado:');
      console.log(error);
      console.error(errMsg);
      console.log('[autenticacion.service.ts](handleError) Token Enviado:');
      console.log(this.token);
    }
    if (errorCode === 200) {
        return;
    }
    this._helper.notificationToast(errMsg, 'Error', 'error');
    if (errorCode === 401) {
        this._router.navigate(['salir']);
    }
    return Observable.throw(errMsg);
  }
  public extractData(res: Response, displayerror: boolean = true) {
    const body = res.json();
    if (!environment.production) {
      // console.log("[autenticacion.service.ts](extractData) Token Enviado:");
      // console.log(this.token)
      // if(environment.depurar)
      // {
      //   console.log("[autenticacion.service.ts](extractData) Body:");
      //   console.log(body);
      // }
      if (body.error) {
        console.log('[autenticacion.service.ts](extractData) Body Error:');
        console.log(body.error);
      }
    }

    // Actualizar token
    if (body.token != null) {
      // if(!environment.production){console.log("Token actualizado: "+body.token)}
      this.token = body.token;
    }

    // Si ha habido un error lanzar mensaje
    if (body.error && displayerror) {
      this._helper.notificationToast(body.error, 'Error', 'error');
    }
    if (body.success && !body.data) {
        const data = {success: true, message: body.success};
        body.data = data;
    }
    return body.data || { };
  }
  public check(ruta:string): Observable<Boolean>{
      const _json = JSON.stringify({ ruta: ruta });
      const _params = "json=" + _json;
      const _headers = new Headers({
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Bearer ' + this.token
      });
      const _options = new RequestOptions({ headers: _headers });
      return this._http.post(app.apiurl+'/seguridad.php/check', _params, {headers: _headers})
          .map((response: Response) => {
              // console.log(response);
              const data = this.extractData(response, false);
              if (data.success){ return true; }
              let message = 'No posee los privilegios necesarios para acceder al recurso solicitado.';
              message += 'Contacto con nosotros para mayor información.';
              this._helper.notificationToast(message, 'Acceso denegado', 'info');
              return false;
          }).catch(err => this.handleError(err));
  }
  public login(usuario: string, clave: string): Observable<boolean> {
    const json = JSON.stringify({ usuario: usuario, clave: clave });
    const params = 'json=' + json;
    const headers = new Headers({
        'Content-Type': 'application/x-www-form-urlencoded'
        });
        // console.log(params);
        return this._http.post(app.apiurl + '/seguridad.php/autenticar', params, {headers: headers})
            .map((response: Response) => {
              console.log(response.json());
              const body = response.json();
              if (body.error) {
                this._helper.notificationToast(body.error,'Inicio de Sesiones', 'error');
              }else {
                this.usuario = body.data[0];
                if (this.usuario.token) {
                  this.token = this.usuario.token;
                  this._helper.revisarAvatarDeUsuario(this.usuario);
                  localStorage.setItem(app.currentuser, JSON.stringify({usuario: this.usuario}));
                  // console.log(localStorage.getItem(app.currentuser));
                  return true;
                }
              }
              return false;
            }); // .catch(err=>this.handleError(err));
  }
  public logout(): void {
      this.token = null;
      localStorage.removeItem(app.currentuser);
      // console.log(localStorage.getItem(app.currentuser));
  }
}
