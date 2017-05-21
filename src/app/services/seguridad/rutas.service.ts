import { Injectable } from '@angular/core';
import { Ruta } from 'app/models/ruta';
import { Helper } from 'app/helpers/helper';
import { AutenticacionService } from './autenticacion.service';
import { app } from '../../../environments/environment';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';

@Injectable()
export class RutasService {

  constructor(
    private _helper:Helper,
    private _autenticacionService:AutenticacionService,
    private _http:Http
  ) { }

  rutas(): Observable<Ruta[]> {
        // agregar cabecera de autorizacion con jwt token
        let _headers = new Headers({ 'Authorization': 'Bearer ' + this._autenticacionService.token });
        let _options = new RequestOptions({ headers: _headers });

        return this._http.get(app.apiurl+'/seguridad.php/rutas', _options)
            // .map((response: Response) => response.json());
            .map((response: Response) => {
              return this._autenticacionService.extractData(response);
            })
            .catch(err=>this._autenticacionService.handleError(err))
            ;
  }
  rutasEnPerfil(perfilid:string): Observable<Ruta[]> {
        // agregar cabecera de autorizacion con jwt token
        let _headers = new Headers({ 'Authorization': 'Bearer ' + this._autenticacionService.token });
        let _options = new RequestOptions({ headers: _headers });

        return this._http.get(app.apiurl+'/seguridad.php/rutasenperfil/'+perfilid, _options)
            // .map((response: Response) => response.json());
            .map((response: Response) => {
              return this._autenticacionService.extractData(response);
            })
            .catch(err=>this._autenticacionService.handleError(err))
            ;
  }
  
}
