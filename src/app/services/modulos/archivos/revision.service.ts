import { Injectable } from '@angular/core';
import { Helper } from 'app/helpers/helper';
import { AutenticacionService } from '../../seguridad/autenticacion.service';
import { app } from '../../../../environments/environment';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import { Revision as Model } from 'app/models/revision';

@Injectable()
export class RevisionService {
  URL = app.apiurl + 'archivos.php/revision';
  TITLE = 'Revisión de documentos';

  constructor(
    private _helper: Helper,
    private _autenticacionService: AutenticacionService,
    private _http: Http
  ) { }

  get(archivoid = null): Observable<Model[]> {
    const _headers = new Headers({ 'Authorization': 'Bearer ' + this._autenticacionService.token });
    const _options = new RequestOptions({ headers: _headers });
    let _url = this.URL + '/';
    if (archivoid !== null) { _url += archivoid; }
    return this._http.get(_url, _options)
        .map((response: Response) => {
          return this._autenticacionService.extractData(response);
        })
        .catch(err => this._autenticacionService.handleError(err))
        ;
  }

  edit(modelid: string, model: Model): Observable<Boolean>{
    const _json = JSON.stringify({ model: model });
    const _params = 'json=' + _json;
    const _headers = new Headers({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Bearer ' + this._autenticacionService.token
    });
    const _options = new RequestOptions({ headers: _headers });
    return this._http.post(this.URL + '/' + modelid, _params, {headers: _headers})
        .map((response: Response) => {
            const data = this._autenticacionService.extractData(response);
            if (data.success && data.message !== '') {
              this._helper.notificationToast(data.message, this.TITLE);
            } else {
              if (data.success){
                this._helper.notificationToast('Datos actualizados satisfactoriamente',this.TITLE);
              }
            }
            if (data.success) { return true; }
            return false;
        }).catch(err => this._autenticacionService.handleError(err));
  }

  add(model: Model): Observable<Boolean>{
    const _json = JSON.stringify({ model: model });
    const _params = 'json=' + _json;
    const _headers = new Headers({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Bearer ' + this._autenticacionService.token
    });
    const _options = new RequestOptions({ headers: _headers });
    return this._http.put(this.URL, _params, {headers: _headers})
        .map((response: Response) => {
            const data = this._autenticacionService.extractData(response);
            if (data.success && data.message !== ''){
              this._helper.notificationToast(data.message, this.TITLE);
            } else {
              if (data.success) {
                this._helper.notificationToast('Registro almacenado satisfactoriamente', this.TITLE);
              }
            }
            if (data.success) { return true; }
            return false;
        }).catch(err => this._autenticacionService.handleError(err));
  }

  del(modelid: string): Observable<Boolean>{
    const _headers = new Headers({ 'Authorization': 'Bearer ' + this._autenticacionService.token });
    const _options = new RequestOptions({ headers: _headers });

    return this._http.delete(this.URL + '/' + modelid, _options)
        .map((response: Response) => {
            const data = this._autenticacionService.extractData(response);
            if (data.success && data.message !== '') {
              this._helper.notificationToast(data.message, this.TITLE);
            } else {
              if (data.success) {
                this._helper.notificationToast('Registro eliminado satisfactoriamente', this.TITLE);
              }
            }
            if (data.success) { return true; }
            return false;
        }).catch(err => this._autenticacionService.handleError(err));
  }

  revisar(archivoid: string, aprobacion: boolean= true) {
    const _headers = new Headers({ 'Authorization': 'Bearer ' + this._autenticacionService.token });
    const _options = new RequestOptions({ headers: _headers });
    const _url = app.apiurl + 'archivos.php/revisar/' + archivoid + '/' + ((aprobacion) ? '1' : '0');
    return this._http.get(_url, _options)
        .map((response: Response) => {
          return this._autenticacionService.extractData(response);
        })
        .catch(err => this._autenticacionService.handleError(err))
        ;
  }

}
