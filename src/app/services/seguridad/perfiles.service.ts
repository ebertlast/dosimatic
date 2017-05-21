import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import { Perfil } from 'app/models/perfil';
import { AutenticacionService } from './autenticacion.service';
import { environment, app  } from '../../../environments/environment';
import { Helper } from 'app/helpers/helper';
@Injectable()
export class PerfilesService {

  constructor(
    private _http:Http,
    private _autenticacionService:AutenticacionService,
    private _helper:Helper
  ) { }
  
  getPerfiles(): Observable<Perfil[]> {
        // agregar cabecera de autorizacion con jwt token
        let _headers = new Headers({ 'Authorization': 'Bearer ' + this._autenticacionService.token });
        let _options = new RequestOptions({ headers: _headers });

        // get perfiles desde la api
        return this._http.get(app.apiurl+'/seguridad.php/perfiles', _options)
            // .map((response: Response) => response.json());
            .map((response: Response) => {
              return this._autenticacionService.extractData(response);
            })
            .catch(err=>this._autenticacionService.handleError(err))
            ;
    }
   getPerfil(perfilId:string): Observable<Perfil> {
        let _headers = new Headers({ 'Authorization': 'Bearer ' + this._autenticacionService.token });
        let _options = new RequestOptions({ headers: _headers });
        return this._http.get(app.apiurl+'/seguridad.php/perfil/'+perfilId, _options)
            .map((response: Response) => {
              return this._autenticacionService.extractData(response);
            })
            .catch(err=>this._autenticacionService.handleError(err))
            ;
    }

   editPerfil(perfilid:string,perfil:Perfil): Observable<Boolean>{
      let _json = JSON.stringify({ perfil: perfil });
      let _params = "json="+_json;
      if(!environment.production){
        console.log("[perfiles.service.ts](editPerfil) Enviando el perfil para ser actualizado en la base de datos");
        console.log(_params);
      }
      let _headers = new Headers({
        // "Content-Type":"application/json; charset=utf-8",
        "Content-Type":"application/x-www-form-urlencoded",
        'Authorization': 'Bearer ' + this._autenticacionService.token
      });
      let _options = new RequestOptions({ headers: _headers });
      return this._http.post(app.apiurl+'/seguridad.php/perfil/'+perfilid, _params, {headers: _headers})
          .map((response: Response) => {
              let data=this._autenticacionService.extractData(response);
              if(data.success&&data.message!=""){
                this._helper.notificationToast(data.message,"Perfiles");
              }else{
                if(data.success)
                  this._helper.notificationToast("Datos del perfil actualizados satisfactoriamente","Perfiles");
              }
              if(data.success) return true;
              return false;
          }).catch(err=>this._autenticacionService.handleError(err));
   }
   
  delPerfil(perfilid:string): Observable<Boolean>{
    let _headers = new Headers({ 'Authorization': 'Bearer ' + this._autenticacionService.token });
    let _options = new RequestOptions({ headers: _headers });

    return this._http.get(app.apiurl+'/seguridad.php/eliminarperfil/'+perfilid, _options)
        .map((response: Response) => {
            let data=this._autenticacionService.extractData(response);
            if(data.success&&data.message!=""){
              this._helper.notificationToast(data.message,"Perfiles");
            }else{
              if(data.success)
                this._helper.notificationToast("El perfil ha sido eliminado satisfactoriamente","Perfiles");
            }
            if(data.success) return true;
            return false;
        }).catch(err=>this._autenticacionService.handleError(err));
  }

  agregarRutaAPerfil(perfilid:string,rutaid:string){
    let _headers = new Headers({ 'Authorization': 'Bearer ' + this._autenticacionService.token });
    let _options = new RequestOptions({ headers: _headers });

    return this._http.get(app.apiurl+'/seguridad.php/agregarrutaaperfil/'+perfilid+"/"+rutaid, _options)
        .map((response: Response) => {
            let data=this._autenticacionService.extractData(response);
            if(data.success&&data.message!=""){
              this._helper.notificationToast(data.message,"Perfiles");
            }else{
              if(data.success)
                this._helper.notificationToast("Permiso habilitado al perfil","Perfiles");
            }
            if(data.success) return true;
            return false;
        }).catch(err=>this._autenticacionService.handleError(err));
  }
  quitarRutaAPerfil(perfilid:string,rutaid:string){
    let _headers = new Headers({ 'Authorization': 'Bearer ' + this._autenticacionService.token });
    let _options = new RequestOptions({ headers: _headers });

    return this._http.get(app.apiurl+'/seguridad.php/quitarrutaaperfil/'+perfilid+"/"+rutaid, _options)
        .map((response: Response) => {
            let data=this._autenticacionService.extractData(response);
            if(data.success&&data.message!=""){
              this._helper.notificationToast(data.message,"Perfiles");
            }else{
              if(data.success)
                this._helper.notificationToast("Permiso desvinculado del perfil","Perfiles");
            }
            if(data.success) return true;
            return false;
        }).catch(err=>this._autenticacionService.handleError(err));
  }

}
