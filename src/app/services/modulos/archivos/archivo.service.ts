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
  URL:string=app.apiurl+'/archivos.php/archivo';
  TITLE:string=this.TITLE;
  
  constructor(
    private _helper:Helper,
    private _autenticacionService:AutenticacionService,
    private _http:Http
  ) { }

  get(): Observable<Model[]> {
        let _headers = new Headers({ 'Authorization': 'Bearer ' + this._autenticacionService.token });
        let _options = new RequestOptions({ headers: _headers });

        return this._http.get(this.URL+"/", _options)
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

  uploadDEPRECATED(file:any){
    let _json = JSON.stringify({ file: file });
    let _params = "json="+_json;
    let _headers = new Headers({
      "Content-Type":"multipart/form-data",
    });
    let _options = new RequestOptions({ headers: _headers });
    return this._http.post(app.apiurl+'/upload', _params, {headers: _headers})
        .map((response: Response) => {
            let data=this._autenticacionService.extractData(response);
            console.log(data);
        }).catch(err=>this._autenticacionService.handleError(err));
  }
  
  upload (postData: any, files: File[], url: string = app.apiurl+"/archivos.php/archivo-upload") {

    let headers = new Headers();
    let formData:FormData = new FormData();
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
    var returnReponse = new Promise((resolve, reject) => {
      this._http.post(url, formData, {
        headers: headers
      }).subscribe(
          res => {
            // this.responseData = res.json();
            // resolve(this.responseData);
            let data=this._autenticacionService.extractData(res);
            // console.log("Data: ");
            // console.log(data);
            resolve(data);
          },
          error => {
            //this.router.navigate(['/login']);
            // console.log(error);
            this._autenticacionService.handleError(error);
            reject(error);
            
          }
      );
    });
    return returnReponse;
  }
  

}
