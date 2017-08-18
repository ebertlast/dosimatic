import { Component, OnInit } from '@angular/core';
import { Archivo, Navlink, Aprobacion } from 'app/models/index';
import { ArchivoService as ModelService} from 'app/services/modulos/archivos/archivo.service';
import { AutenticacionService } from 'app/services/seguridad/autenticacion.service';
import { AprobacionService } from 'app/services/modulos/archivos/aprobacion.service';
import { AppComponent } from 'app/app.component';
import { PagerService } from 'app/services/general/pager.service';
declare var $: any;

@Component({
  selector: 'app-archivos',
  templateUrl: './archivos.component.html',
  styleUrls: ['./archivos.component.css']
})

export class ArchivosComponent implements OnInit {
  modelList: Archivo[]= [];
  public aprobaciones: Aprobacion[]= [];
  public message = '';
  public filtro= '';
  pager: any = {};
  pagedItems: Archivo[] = [];
  allItems: Archivo[] = [];

  constructor(private _modelService: ModelService, private _appComponent: AppComponent,
    private _autenticacionService: AutenticacionService,
    private _aprobacionService: AprobacionService,
    private _pagerService: PagerService
    ) {
    this.refreshModels();
  }
  public setFiltro(event) {
    this.filtro = event.filtro;
    this.consultarArchivos();
  }

  ngOnInit() {
    $('.i-checks').iCheck({
      checkboxClass: 'icheckbox_square-green',
      radioClass: 'iradio_square-green',
    });

    const links: Navlink[] = [
      {url: '', title: 'Gestión Documental', active: true},
      {url: '/archivos', title: 'Documentos', active: true},
    ];
    this._appComponent.setLinks(links);
    this.getAprobaciones();
  }

  refreshModels() {
    this._modelService.get()
    .subscribe(
      list => {
        this.modelList = list;
        this.allItems = list;
        this.consultarArchivos();
      }
      );
  }

  public archivoLeido(archivoid: string, usuario: string = this._autenticacionService.usuario.usuario) {
    return true;
  }

  getAprobaciones() {
    this.aprobaciones = [];
    const usuario = this._autenticacionService.usuario.usuario;
    this._aprobacionService.get()
    .subscribe(
      aprobaciones => {
        aprobaciones.forEach(aprobacion => {
          // console.log(aprobacion);

          if ((!aprobacion.aprobado || aprobacion.aprobado.toString() === '0' ) && usuario === aprobacion.usuario) {
            // console.log(aprobacion);
            this.aprobaciones.push(aprobacion);
          }else {
            // let index = this.aprobaciones.indexOf(aprobacion);
            // this.aprobaciones.splice(index, 1);
          }
        });

      }
      );
  }

  setPage(page: number) {
    if (page < 1) {
      return;
    }
    this.pager = this._pagerService.getPager(this.allItems.length, page, 5);
    this.pagedItems = this.allItems.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }

  consultarArchivos() {
    // console.log("Filtro:"+this.filtro);
    this.allItems = this.modelList;
    if (this.filtro === '' && this.filtro !== '') {
      this.setPage(1);
      return;
    }
    if (this.filtro === 'in:pendientes') {
      const archivosPendientes: Archivo[] = [];
      const usuario = this._autenticacionService.usuario.usuario;
      this.modelList.forEach(archivo => {
        this.aprobaciones.forEach(aprobacion => {
          if (aprobacion.archivoid === archivo.archivoid) {
            if (aprobacion.usuario === usuario && (!aprobacion.aprobado || aprobacion.aprobado.toString() === '0')) {
              archivosPendientes.push(archivo);
            }
          }
        });
      });
      this.allItems = archivosPendientes;
    }else {
      const re = new RegExp(this.filtro.toLowerCase(), 'g');
      const ss = this.modelList;
      const matches = ss.filter(function(s) {
        const concat = s.archivoid.concat(s.denominacion).concat(s.archivoidaux).toLowerCase();
        return concat.toLowerCase().match(re);
      });
      this.allItems = matches;
    }
    if ( this.allItems.length <= 0 ) {
      this.message = 'Has escrito (' + this.filtro;
      this.message += ') y el o los registros que contienen ese texto como nombre no están disponibles en este momento';
    }else {
      this.message = '';
    }
    this.setPage(1);
  }
}
