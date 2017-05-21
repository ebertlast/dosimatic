import { Component, OnInit } from '@angular/core';
import { Archivo } from 'app/models/archivo'
import { Navlink } from 'app/models/navlink'
import { ArchivoService as ModelService} from 'app/services/modulos/archivos/archivo.service';
import { AppComponent } from 'app/app.component';
declare var $:any;
@Component({
  selector: 'app-archivos',
  templateUrl: './archivos.component.html',
  styleUrls: ['./archivos.component.css']
})
export class ArchivosComponent implements OnInit {
  modelList:Archivo[]=[];
  constructor(private _modelService:ModelService, private _appComponent:AppComponent) { }

  ngOnInit() {
    $('.i-checks').iCheck({
        checkboxClass: 'icheckbox_square-green',
        radioClass: 'iradio_square-green',
    });

    let links:Navlink[]=[
      {url:"",title:"Gestión Documental",active:true},
      {url:"/archivos",title:"Documentos",active:true},
      ];
    this._appComponent.setLinks(links);
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
