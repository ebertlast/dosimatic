import { Injectable } from '@angular/core';
import { Helper } from 'app/helpers/helper';
import { AutenticacionService } from '../../seguridad/autenticacion.service';
import { app } from '../../../../environments/environment';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import { Archivo as Model } from 'app/models/archivo';

@Injectable()
export class ArchivoService {
  URL = app.apiurl + '/archivos.php/archivo';
  TITLE = 'Documentación';

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

  edit(modelid: string, model: Model): Observable<Boolean> {
      // console.log(model);
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
              }else {
                if (data.success) {
                  this._helper.notificationToast('Datos actualizados satisfactoriamente', this.TITLE);
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
            if (data.success && data.message !== '') {
              this._helper.notificationToast(data.message, this.TITLE);
            } else {
              if (data.success) {
                this._helper.notificationToast('Registro almacenado satisfactoriamente',this.TITLE);
              }
            }
            if (data.success) { return true; }
            return false;
        }).catch(err => this._autenticacionService.handleError(err));
  }

  del(modelid:string): Observable<Boolean>{
    const _headers = new Headers({ 'Authorization': 'Bearer ' + this._autenticacionService.token });
    const _options = new RequestOptions({ headers: _headers });

    return this._http.delete(this.URL + '/' + modelid, _options)
        .map((response: Response) => {
            const data = this._autenticacionService.extractData(response);
            if (data.success&&data.message != ''){
              this._helper.notificationToast(data.message,this.TITLE);
            }else{
              if (data.success) {
                this._helper.notificationToast('Registro eliminado satisfactoriamente', this.TITLE);
              }
            }
            if (data.success) { return true; }
            return false;
        }).catch(err => this._autenticacionService.handleError(err));
  }

  uploadDEPRECATED(file:any){
    const _json = JSON.stringify({ file: file });
    const _params = 'json='+_json;
    const _headers = new Headers({
      'Content-Type': 'multipart/form-data',
    });
    const _options = new RequestOptions({ headers: _headers });
    return this._http.post(app.apiurl + '/upload', _params, {headers: _headers})
        .map((response: Response) => {
            const data = this._autenticacionService.extractData(response);
            // console.log(data);
        }).catch(err => this._autenticacionService.handleError(err));
  }

  upload (postData: any, files: File[], url: string = app.apiurl + '/archivos.php/archivo-upload') {

    const headers = new Headers();
    const formData:FormData = new FormData();
    formData.append('files', files[0], files[0].name);
    // Para multiples subidas
    // for (let i = 0; i < files.length; i++) {
    //     formData.append(`files[]`, files[i], files[i].name);
    // }

    if(postData !=="" && postData !== undefined && postData !==null){
      for (var property in postData) {
          if (postData.hasOwnProperty(property)) {
              formData.append(property, postData[property]);
          }
      }
    }
    const returnReponse = new Promise((resolve, reject) => {
      this._http.post(url, formData, {
        headers: headers
      }).subscribe(
          res => {
            // this.responseData = res.json();
            // resolve(this.responseData);
            const data = this._autenticacionService.extractData(res);
            // console.log("Data: ");
            // console.log(data);
            resolve(data);
          },
          error => {
            // this.router.navigate(['/login']);
            // console.log(error);
            this._autenticacionService.handleError(error);
            reject(error);

          }
      );
    });
    return returnReponse;
  }

  download(archivoid): Observable<any> {
        const _headers = new Headers({ 'Authorization': 'Bearer ' + this._autenticacionService.token });
        const _options = new RequestOptions({ headers: _headers });
        const _url = app.apiurl + 'archivos.php/archivo-download/' + archivoid;
        // console.log(_url);

        return this._http.get(_url, _options)
            .map((response: Response) => {
              return this._autenticacionService.extractData(response);
            })
            .catch(err => this._autenticacionService.handleError(err))
            ;
  }



}
