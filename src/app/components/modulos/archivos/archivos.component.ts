import { Component, OnInit } from '@angular/core';
import { Archivo } from 'app/models/archivo'
import { ArchivoService as ModelService} from 'app/services/modulos/archivos/archivo.service';
declare var $:any;
@Component({
  selector: 'app-archivos',
  templateUrl: './archivos.component.html',
  styleUrls: ['./archivos.component.css']
})
export class ArchivosComponent implements OnInit {
  modelList:Archivo[]=[];
  constructor(private _modelService:ModelService) { }

  ngOnInit() {
    $('.i-checks').iCheck({
        checkboxClass: 'icheckbox_square-green',
        radioClass: 'iradio_square-green',
    });
  }

  refreshModels(){
      this._modelService.get()
          .subscribe(
            list => {
              this.modelList=list;
              console.log(this.modelList);
            }
          )
          .unsubscribe()

      ;      
      
  }

}
