import { Injectable, Inject } from '@angular/core';
import { Usuario } from 'app/models/usuario';
import { Helper } from 'app/helpers/helper';
import { AutenticacionService } from './autenticacion.service';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { app, environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';

@Injectable()
export class UsuariosService {  
  constructor(
    private _helper:Helper,
    private _autenticacionService:AutenticacionService,
    @Inject(Http) private _http:Http
  ) { }

  getUsuariosEnPerfil(perfilid:string): Observable<Usuario[]> {
    // agregar cabecera de autorizacion con jwt token
    let _headers = new Headers({ 'Authorization': 'Bearer ' + this._autenticacionService.token });
    let _options = new RequestOptions({ headers: _headers });

    // get perfiles desde la api
    return this._http.get(app.apiurl+'/seguridad.php/usuariosenperfil/'+perfilid, _options)
        // .map((response: Response) => response.json());
        .map((response: Response) => {
          return this._autenticacionService.extractData(response);
        })
        .catch(err=>this._autenticacionService.handleError(err))
        ;
  }
  getUsuariosFueraDelPerfil(perfilid:string): Observable<Usuario[]> {
        // agregar cabecera de autorizacion con jwt token
        let _headers = new Headers({ 'Authorization': 'Bearer ' + this._autenticacionService.token });
        let _options = new RequestOptions({ headers: _headers });

        // get perfiles desde la api
        return this._http.get(app.apiurl+'/seguridad.php/usuariosfueraperfil/'+perfilid, _options)
            // .map((response: Response) => response.json());
            .map((response: Response) => {
              return this._autenticacionService.extractData(response);
            })
            .catch(err=>this._autenticacionService.handleError(err))
            ;
  }
  getUsuarios(): Observable<Usuario[]> {
        // agregar cabecera de autorizacion con jwt token
        let _headers = new Headers({ 'Authorization': 'Bearer ' + this._autenticacionService.token });
        let _options = new RequestOptions({ headers: _headers });

        // get perfiles desde la api
        return this._http.get(app.apiurl+'/seguridad.php/usuarios', _options)
            // .map((response: Response) => response.json());
            .map((response: Response) => {
              return this._autenticacionService.extractData(response);
            })
            .catch(err=>this._autenticacionService.handleError(err))
            ;
  }
  getUsuario(usuarioid:string): Observable<Usuario> {
        // agregar cabecera de autorizacion con jwt token
        let _headers = new Headers({ 'Authorization': 'Bearer ' + this._autenticacionService.token });
        let _options = new RequestOptions({ headers: _headers });

        // get perfiles desde la api
        return this._http.get(app.apiurl+'/seguridad.php/usuario/'+usuarioid, _options)
            // .map((response: Response) => response.json());
            .map((response: Response) => {
              return this._autenticacionService.extractData(response);
            })
            .catch(err=>this._autenticacionService.handleError(err))
            ;
  }
  addUsuario(usuario:Usuario): Observable<Boolean>{
      let _json = JSON.stringify({ usuario: usuario });
      let _params = "json="+_json;
      if(!environment.production){
        console.log("[usuarios.service.ts](addUsuario) Enviando el usuario para ser registrado en la base de datos");
        console.log(_params);
      }
      let _headers = new Headers({
        // "Content-Type":"application/json; charset=utf-8",
        "Content-Type":"application/x-www-form-urlencoded",
        'Authorization': 'Bearer ' + this._autenticacionService.token
      });
      let _options = new RequestOptions({ headers: _headers });
      return this._http.post(app.apiurl+'/seguridad.php/usuario', _params, {headers: _headers})
        .map((response: Response) => {
            let data=this._autenticacionService.extractData(response);
            if(data.success&&data.message!=""){
              this._helper.notificationToast(data.message,"Usuarios");
            }else{
              if(data.success)
                this._helper.notificationToast("Usuario registrado","Usuarios");
            }
            if(data.success) return true;
            return false;
        }).catch(err=>this._autenticacionService.handleError(err));
  }
  asignarPerfil(usuario:string,perfilid:string): Observable<boolean> {
        // agregar cabecera de autorizacion con jwt token
        let _headers = new Headers({ 'Authorization': 'Bearer ' + this._autenticacionService.token });
        let _options = new RequestOptions({ headers: _headers });

        // get perfiles desde la api
        return this._http.get(app.apiurl+'/seguridad.php/asignarperfil/'+usuario+'/'+perfilid, _options)
            // .map((response: Response) => response.json());
            .map((response: Response) => {
              // return this._autenticacionService.extractData(response);
              let data=this._autenticacionService.extractData(response);
              if(data.success&&data.message!=""){
                this._helper.notificationToast(data.message,"Perfiles");
              }else{
                if(data.success)
                  this._helper.notificationToast("Usuario asignado al perfil satisfactoriamente","Perfiles");
              }
              if(data.success) return true;
              return false;


            })
            .catch(err=>this._autenticacionService.handleError(err))
            ;
  }
  quitarPerfil(usuario:string,perfilid:string): Observable<boolean> {
        // agregar cabecera de autorizacion con jwt token
        let _headers = new Headers({ 'Authorization': 'Bearer ' + this._autenticacionService.token });
        let _options = new RequestOptions({ headers: _headers });

        // get perfiles desde la api
        return this._http.get(app.apiurl+'/seguridad.php/quitarperfil/'+usuario, _options)
            // .map((response: Response) => response.json());
            .map((response: Response) => {
              // return this._autenticacionService.extractData(response);
              let data=this._autenticacionService.extractData(response);
              if(data.success&&data.message!=""){
                this._helper.notificationToast(data.message,"Perfiles");
              }else{
                if(data.success)
                  this._helper.notificationToast("Usuario desvinculado del perfil satisfactoriamente","Perfiles");
              }
              if(data.success) return true;
              return false;
            })
            .catch(err=>this._autenticacionService.handleError(err))
            ;
  }

  setStatus(usuario:string,activo:boolean=false): Observable<boolean> {
        // agregar cabecera de autorizacion con jwt token
        let _headers = new Headers({ 'Authorization': 'Bearer ' + this._autenticacionService.token });
        let _options = new RequestOptions({ headers: _headers });
        // get perfiles desde la api
        return this._http.get(app.apiurl+'/seguridad.php/cambiarstatus/'+usuario+'/'+(+activo), _options)
            // .map((response: Response) => response.json());
            .map((response: Response) => {
              // return this._autenticacionService.extractData(response);
              let data=this._autenticacionService.extractData(response);
              if(data.success&&data.message!=""){
                this._helper.notificationToast(data.message,"Usuarios");
              }else{
                if(data.success)
                  this._helper.notificationToast("Estado del usuario actualizado satisfactoriamente","Usuarios");
              }
              if(data.success) return true;
              return false;


            })
            .catch(err=>this._autenticacionService.handleError(err))
            ;
  }
  
  editUsuario(usuarioOLD:string,usuario:Usuario): Observable<Boolean>{
      let _json = JSON.stringify({ usuario: usuario });
      let _params = "json="+_json;
      if(!environment.production){
        console.log("[usuarios.service.ts](editUsuario) Enviando el usuario para ser actualizado en la base de datos");
        console.log(_params);
      }
      let _headers = new Headers({
        // "Content-Type":"application/json; charset=utf-8",
        "Content-Type":"application/x-www-form-urlencoded",
        'Authorization': 'Bearer ' + this._autenticacionService.token
      });
      let _options = new RequestOptions({ headers: _headers });
      return this._http.post(app.apiurl+'/seguridad.php/usuario/'+usuarioOLD, _params, {headers: _headers})
          .map((response: Response) => {
              let data=this._autenticacionService.extractData(response);
              if(data.success&&data.message!=""){
                this._helper.notificationToast(data.message,"Usuarios");
              }else{
                if(data.success)
                  this._helper.notificationToast("Datos del usuario actualizados satisfactoriamente","Usuarios");
              }
              if(data.success) return true;
              return false;
          }).catch(err=>this._autenticacionService.handleError(err));
   }
}
