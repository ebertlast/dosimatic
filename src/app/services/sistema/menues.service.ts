import { Injectable } from '@angular/core';
import { Menu } from 'app/models/menu';
import { Helper } from 'app/helpers/helper';
import { AutenticacionService } from 'app/services/seguridad/autenticacion.service';
import { app, environment } from '../../../environments/environment';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';


@Injectable()
export class MenuesService {
  constructor(private _helper: Helper,
    private _autenticacionService: AutenticacionService,
    private _http: Http) { }

  getMenues(usuario: string): Observable<Menu[]> {
        // agregar cabecera de autorizacion con jwt token
        const _headers = new Headers({ 'Authorization': 'Bearer ' + this._autenticacionService.token });
        const _options = new RequestOptions({ headers: _headers });

        return this._http.get(app.apiurl + '/seguridad.php/menues/' + usuario, _options)
            // .map((response: Response) => response.json());
            .map((response: Response) => {
              return this._autenticacionService.extractData(response);
            })
            .catch(err => this._autenticacionService.handleError(err))
            ;
  }
  getAllMenues(): Observable<Menu[]> {
    // agregar cabecera de autorizacion con jwt token
    const _headers = new Headers({ 'Authorization': 'Bearer ' + this._autenticacionService.token });
    const _options = new RequestOptions({ headers: _headers });

    return this._http.get(app.apiurl+'/seguridad.php/allmenues', _options)
        // .map((response: Response) => response.json());
        .map((response: Response) => {
          return this._autenticacionService.extractData(response);
        })
        .catch(err => this._autenticacionService.handleError(err))
        ;
  }
  editMenu(menuid: string, menu: Menu): Observable<Boolean>{
      const _json = JSON.stringify({ menu: menu });
      const _params = "json="+_json;
      if(!environment.production){
        // console.log("[Menues.service.ts](editMenu) Enviando el menu para ser actualizado en la base de datos");
        // console.log(_params);
      }
      const _headers = new Headers({
        // "Content-Type":"application/json; charset=utf-8",
        'Content-Type':'application/x-www-form-urlencoded',
        'Authorization': 'Bearer ' + this._autenticacionService.token
      });
      const _options = new RequestOptions({ headers: _headers });
      return this._http.post(app.apiurl+'/seguridad.php/menu/' + menuid, _params, {headers: _headers})
          .map((response: Response) => {
              const data = this._autenticacionService.extractData(response);
              if(data.success && data.message != '') {
                this._helper.notificationToast(data.message,"Menues");
              }else{
                if(data.success)
                  this._helper.notificationToast("Datos del menu actualizados satisfactoriamente","Menues");
              }
              if(data.success) return true;
              return false;
          }).catch(err=>this._autenticacionService.handleError(err));
  }
   
  addMenu(menu:Menu): Observable<Boolean>{
    let _json = JSON.stringify({ menu: menu });
    let _params = "json="+_json;
    if(!environment.production){
      // console.log("[Menues.service.ts](editMenu) Enviando el menu para ser actualizado en la base de datos");
      // console.log(_params);
    }
    let _headers = new Headers({
      // "Content-Type":"application/json; charset=utf-8",
      "Content-Type":"application/x-www-form-urlencoded",
      'Authorization': 'Bearer ' + this._autenticacionService.token
    });
    let _options = new RequestOptions({ headers: _headers });
    return this._http.post(app.apiurl+'/seguridad.php/menu', _params, {headers: _headers})
        .map((response: Response) => {
            let data=this._autenticacionService.extractData(response);
            if(data.success&&data.message!=""){
              this._helper.notificationToast(data.message,"Menues");
            }else{
              if(data.success)
                this._helper.notificationToast("Menu registrado","Menues");
            }
            if(data.success) return true;
            return false;
        }).catch(err=>this._autenticacionService.handleError(err));
  }

  delMenu(menuid:string): Observable<Boolean>{
    let _headers = new Headers({ 'Authorization': 'Bearer ' + this._autenticacionService.token });
    let _options = new RequestOptions({ headers: _headers });

    return this._http.get(app.apiurl+'/seguridad.php/eliminarmenu/'+menuid, _options)
        .map((response: Response) => {
            let data=this._autenticacionService.extractData(response);
            if(data.success&&data.message!=""){
              this._helper.notificationToast(data.message,"Menues");
            }else{
              if(data.success)
                this._helper.notificationToast("El menu ha sido eliminado satisfactoriamente","Menues");
            }
            if(data.success) return true;
            return false;
        }).catch(err=>this._autenticacionService.handleError(err));
  }

}
