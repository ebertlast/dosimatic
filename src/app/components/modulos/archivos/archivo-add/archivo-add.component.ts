import { Component, OnInit } from '@angular/core';
import { Navlink as Link} from 'app/models/navlink';
import { Archivo as Model} from 'app/models/archivo';
import { Convencion } from 'app/models/convencion';
import { Gestion } from 'app/models/gestion';

import { AppComponent } from 'app/app.component';
import { app } from '../../../../../environments/environment';
import { Helper } from 'app/helpers/helper';
import { ArchivoService as ModelService } from 'app/services/modulos/archivos/archivo.service';
import { GestionService } from 'app/services/modulos/archivos/gestion.service';
import { ConvencionService  } from 'app/services/modulos/archivos/convencion.service';
import { AutenticacionService } from 'app/services/seguridad/autenticacion.service';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
declare var $:any;
@Component({
  selector: 'app-archivo-add',
  templateUrl: './archivo-add.component.html',
  styleUrls: ['./archivo-add.component.css']
})
export class ArchivoAddComponent implements OnInit {
  model: Model = new Model();
  models: Model[] = [];
  convenciones: Convencion[] = [];
  gestiones: Gestion[] = [];
  uploading = false;
  excel = true;
  constructor(
    private _appComponent: AppComponent,
    public _helper: Helper,
    private _modelService: ModelService,
    private _gestionService: GestionService,
    private _convencionService: ConvencionService,
    private _autenticacionService: AutenticacionService,
    private _router: Router
  ) {
    this.model.usuario = this._autenticacionService.usuario.usuario;
  }

  ngOnInit() {
    const links: Link[] = [
      {url: '', title: 'Gestión Documental', active: true},
      {url: '/archivos', title: 'Documentos', active: false},
      {url: '', title: 'Nuevo documento', active: true},
      ];
    this._appComponent.setLinks(links);
    this.gestionesReload();
    this.convencionesReload();
    this.modelsReload();
  }
  gestionesReload() {
    this.gestiones = [];
     this._gestionService.gestiones()
          .subscribe(
            list => {
              this.gestiones = list;
		          // console.log("Gestiones: ");
		          // console.log(this.gestiones);
          }
        );
  }
  convencionesReload() {
    this.convenciones = [];
    this._convencionService.get()
        .subscribe(
          list => {
            this.convenciones = list;
		        // console.log("Convenciones: ");
		        // console.log(this.convenciones);
          }
        );
  }

  fileChangeEvent(filesInput: any) {
    const files = filesInput.srcElement.files;
    if (files.length <= 0) {
      return;
    }
    const postData = {field1: 'field1', field2: 'field2'}; // Put your form data variable. This is only example.
    this.uploading = true;
    this._modelService.upload(postData, files).then(nombre => {
        // console.log(nombre);
        this.model.nombre = nombre.toString();
        this.uploading = false;
    });
  }

  modelsReload() {
    // if(this.model.convencionid!==''&&this.model.gestionid!==''){
      this._modelService.get()
          .subscribe(
            list => {
              this.models = list;
            }
      );
    // }
  }
  archivoid() {
    if (this.models.length <= 0) {
      this.model.archivoid = this.model.convencionid + this.model.gestionid + '001';
    }else {
      let i = 1;
      this.models.forEach(x => {
        if (this.model.convencionid === x.convencionid && this.model.gestionid === x.gestionid) {
          i++;
        }
      });
      let id = '000' + i.toString();
      this.model.archivoid = this.model.convencionid + this.model.gestionid + id.substr(id.length - 2);

      if (this.model.archivoidaux !== '') {
        this.model.archivoid = this.model.archivoidaux;
        const omitido = true;
        if (!omitido) {
          this.model.archivoid = '';
          let j = this.model.archivoidaux.length;
          let letra = '';
          while (j--) {
            letra = this.model.archivoidaux[j];
            if (letra >= '0' && letra <= '9') {
            }else {
              this.model.archivoid = (this.model.archivoidaux[j]) + this.model.archivoid;
            }
          }
        }else {

        }
        this.model.archivoid = this.model.convencionid + this.model.archivoid;

        i = 1;
        this.models.forEach(x => {
          if (this.model.archivoidaux === x.archivoidaux){ i++; }
        });
        id = '000' + i.toString();
        this.model.archivoid += '-' + id.substr(id.length - 2);
      }

    }
    console.log(this.model);
  }

  onSubmitHandler() {
    if (this.model.archivoid === '') {
      this._helper.notificationToast('Debes ingresar un identificador al documento', 'Gestión Documental', 'error');
      return false;
    }
    if (this.model.gestionid === '') {
      this._helper.notificationToast('Debes seleccionar el proceso que pertenece el documento', 'Gestión Documental', 'error');
      return false;
    }
    if (this.model.convencionid === '') {
      this._helper.notificationToast('Debes seleccionar la convención del documento', 'Gestión Documental', 'error');
      return false;
    }
    if (this.model.nombre === '') {
      this._helper.notificationToast('Debes seleccionar un documento', 'Gestión Documental', 'error');
      return false;
    }

    this._modelService.add(this.model)
        .subscribe(
          success => {
            if (success === true) {
              this._helper.notificationToast('Documento agregado satisfactoriamente a la base de datos.', 'Gestión Documental');
              this._router.navigate(['/archivos']);
            }
          }
        );
    return false;


  }

}
