import { Component, OnInit } from '@angular/core';
import { Archivo } from 'app/models/archivo';
import { Gestion } from 'app/models/gestion';
import { Convencion } from 'app/models/convencion';
import { ArchivoService } from 'app/services/modulos/archivos/archivo.service';
import { GestionService } from 'app/services/modulos/archivos/gestion.service';
import { ConvencionService} from 'app/services/modulos/archivos/convencion.service';
import { app } from '../../../../../environments/environment';

declare var $: any;
@Component({
  selector: 'app-organizado',
  templateUrl: './organizado.component.html',
  styleUrls: ['./organizado.component.css']
})
export class OrganizadoComponent implements OnInit {
  private archivos: Archivo[] = [];
  public gestiones: Gestion[] = [];
  private convenciones: Convencion[] = [];
  private obsoletos: boolean = false;
  constructor(
    private _archivoService: ArchivoService, 
    private _gestionService: GestionService,
    private _convencionService: ConvencionService
    ) { }
  public cargarArchivos() {
    this.archivos = [];
    if(!this.obsoletos){
      this._archivoService.get()
      .subscribe(
        list => {
          this.archivos = list;
          // this.allItems = this.archivos;
          // console.log(this.archivos);
          // this.consultarArchivos();

          // this.archivos.forEach(function(archivo){
            //   if(archivo.gestionid==='GF' && archivo.convencionid==='F') {          
              //     // console.log(archivo.archivoid);
              //   }
              // });
            }
            )
      ;
    }else{
      this._archivoService.getObsoletos()
      .subscribe(list => {
        this.archivos = list;
      });
    }
  }
  public cargarGestiones() {
    this._gestionService.gestiones()
    .subscribe(
      gestiones => {
        this.gestiones = gestiones;
        // console.log("Gestiones: ");
        // console.log(this.gestiones);
      }
      );
  }
  public cargarConvenciones(){
    this._convencionService.get()
    .subscribe(
      list => {
        this.convenciones=list;
        // console.log("Convenciones: ");
        // console.log(this.convenciones);
      }
      );
  }
  ngOnInit() {
    this.cargarArchivos();
    this.cargarGestiones();
    this.cargarConvenciones();

    // Add slimscroll to element
    $('.scroll_content').slimscroll({
      height: '200px'
    })


  }

  public download(archivoid: string) {
    this._archivoService.download(archivoid)
    .subscribe(
      data => {
        // console.log(data);
        window.open(app.apiurl + data.filename);
        // this.downloadFile(data);
        // console.log(data);
      }
      );
  }


  public maestro() {
    this._archivoService.listadoMaestro()
    .subscribe(
      data => {
        // console.log(data);
        window.open(app.apiurl + data.filename);
        // this.downloadFile(data);
        // console.log(data);
      }
      );
  }

}
