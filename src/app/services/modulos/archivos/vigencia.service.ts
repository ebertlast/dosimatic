import { Injectable } from '@angular/core';
import { Helper } from 'app/helpers/helper';
import { AutenticacionService } from '../../seguridad/autenticacion.service';
import { app } from '../../../../environments/environment';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import { Vigencia as Model } from 'app/models/vigencia';

@Injectable()
export class VigenciaService {

  URL:string=app.apiurl+'/archivos.php/vigencia';
  TITLE:string="Vigencia de documentos";

  constructor(
    private _helper:Helper,
    private _autenticacionService:AutenticacionService,
    private _http:Http
  ) { }

  get(archivoid=""): Observable<Model[]> {
        let _headers = new Headers({ 'Authorization': 'Bearer ' + this._autenticacionService.token });
        let _options = new RequestOptions({ headers: _headers });

        return this._http.get(this.URL+"/"+archivoid, _options)
            .map((response: Response) => {
              return this._autenticacionService.extractData(response);
            })
            .catch(err=>this._autenticacionService.handleError(err))
            ;
  }

  edit(modelid:string, model:Model): Observable<Boolean>{
      let _json = JSON.stringify({ model: model });
      let _params = "json="+_json;
      let _headers = new Headers({
        "Content-Type":"application/x-www-form-urlencoded",
        'Authorization': 'Bearer ' + this._autenticacionService.token
      });
      let _options = new RequestOptions({ headers: _headers });
      return this._http.post(this.URL+'/'+modelid, _params, {headers: _headers})
          .map((response: Response) => {
              let data=this._autenticacionService.extractData(response);
              if(data.success&&data.message!=""){
                this._helper.notificationToast(data.message,this.TITLE);
              }else{
                if(data.success)
                  this._helper.notificationToast("Datos actualizados satisfactoriamente",this.TITLE);
              }
              if(data.success) return true;
              return false;
          }).catch(err=>this._autenticacionService.handleError(err));
  }

  add(model:Model): Observable<Boolean>{
    let _json = JSON.stringify({ model: model });
    let _params = "json="+_json;
    let _headers = new Headers({
      "Content-Type":"application/x-www-form-urlencoded",
      'Authorization': 'Bearer ' + this._autenticacionService.token
    });
    let _options = new RequestOptions({ headers: _headers });
    return this._http.put(this.URL, _params, {headers: _headers})
        .map((response: Response) => {
            let data=this._autenticacionService.extractData(response);
            if(data.success&&data.message!=""){
              this._helper.notificationToast(data.message,this.TITLE);
            }else{
              if(data.success)
                this._helper.notificationToast("Registro almacenado satisfactoriamente",this.TITLE);
            }
            if(data.success) return true;
            return false;
        }).catch(err=>this._autenticacionService.handleError(err));
  }

  del(modelid:string): Observable<Boolean>{
    let _headers = new Headers({ 'Authorization': 'Bearer ' + this._autenticacionService.token });
    let _options = new RequestOptions({ headers: _headers });

    return this._http.delete(this.URL+'/'+modelid, _options)
        .map((response: Response) => {
            let data=this._autenticacionService.extractData(response);
            if(data.success&&data.message!=""){
              this._helper.notificationToast(data.message,this.TITLE);
            }else{
              if(data.success)
                this._helper.notificationToast("Registro eliminado satisfactoriamente",this.TITLE);
            }
            if(data.success) return true;
            return false;
        }).catch(err=>this._autenticacionService.handleError(err));
  }
}
