import { Injectable } from '@angular/core';
import { Helper } from 'app/helpers/helper';
import { AutenticacionService } from '../../seguridad/autenticacion.service';
import { app } from '../../../../environments/environment';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import { Gestion } from 'app/models/gestion';
@Injectable()
export class GestionService {

  constructor(
    private _helper:Helper,
    private _autenticacionService:AutenticacionService,
    private _http:Http
  ) { }

  gestiones(): Observable<Gestion[]> {
        // agregar cabecera de autorizacion con jwt token
        const _headers = new Headers({ 'Authorization': 'Bearer ' + this._autenticacionService.token });
        const _options = new RequestOptions({ headers: _headers });

        return this._http.get(app.apiurl + '/archivos.php/gestion', _options)
            // .map((response: Response) => response.json());
            .map((response: Response) => {
              return this._autenticacionService.extractData(response);
            })
            .catch(err => this._autenticacionService.handleError(err))
            ;
  }
  editGestion(gestionid: string, gestion: Gestion): Observable<Boolean> {
      const _json = JSON.stringify({ gestion: gestion });
      const _params = 'json=' + _json;
      const _headers = new Headers({
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Bearer ' + this._autenticacionService.token
      });
      const _options = new RequestOptions({ headers: _headers });
      return this._http.post(app.apiurl + '/archivos.php/gestion/' + gestionid, _params, {headers: _headers})
          .map((response: Response) => {
              const data = this._autenticacionService.extractData(response);
              if (data.success && data.message !== '') {
                this._helper.notificationToast(data.message, 'Gestiones');
              }else {
                if (data.success) {
                  this._helper.notificationToast('Datos del registro actualizados satisfactoriamente', 'Gestión de Procesos');
                }
              }
              if (data.success) { return true; }
              return false;
          }).catch(err => this._autenticacionService.handleError(err));
  }
  addGestion(gestion: Gestion): Observable<Boolean>{
    const _json = JSON.stringify({ gestion: gestion });
    const _params = 'json=' + _json;
    const _headers = new Headers({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Bearer ' + this._autenticacionService.token
    });
    const _options = new RequestOptions({ headers: _headers });
    return this._http.put(app.apiurl + '/archivos.php/gestion', _params, {headers: _headers})
        .map((response: Response) => {
            const data = this._autenticacionService.extractData(response);
            if (data.success && data.message !== ''){
              this._helper.notificationToast(data.message, 'Gestiones');
            }else {
              if (data.success) {
                this._helper.notificationToast('Registro agregado a la base de datos', 'Gestiones');
              }
            }
            if (data.success) { return true; }
            return false;
        }).catch( err => this._autenticacionService.handleError(err));
  }

  delGestion(gestionid:string): Observable<Boolean> {
    const _headers = new Headers({ 'Authorization': 'Bearer ' + this._autenticacionService.token });
    const _options = new RequestOptions({ headers: _headers });

    return this._http.delete(app.apiurl + '/archivos.php/gestion/' + gestionid, _options)
        .map((response: Response) => {
            const data = this._autenticacionService.extractData(response);
            if (data.success && data.message !== ''){
              this._helper.notificationToast(data.message, 'Gestión de Procesos');
            }else {
              if (data.success){
                this._helper.notificationToast('El proceso ha sido eliminado satisfactoriamente', 'Gestión de Procesos');
              }
            }
            if(data.success) { return true; }
            return false;
        }).catch(err => this._autenticacionService.handleError(err));
  }
}
