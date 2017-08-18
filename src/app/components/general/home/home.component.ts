import { Component, OnInit } from '@angular/core';
import { AppComponent } from 'app/app.component';
import { Navlink } from 'app/models/navlink';
import { Archivo } from 'app/models/archivo';
import { Convencion } from 'app/models/convencion';
import { ArchivoService } from 'app/services/modulos/archivos/archivo.service';
import { ConvencionService } from 'app/services/modulos/archivos/convencion.service';
import { PagerService } from 'app/services/general/pager.service';
import { Helper } from 'app/helpers/helper';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public archivos: Archivo[] = [];
  public filtro = '';
  public filtroAux = '';
  public message = '';
  public allItems: Archivo[] = [];
  public intervalo = 0;
  pager: any = {};
  pagedItems: Archivo[] = [];
  public convenciones: Convencion[] = [];
  public convencion: string = '';
  public textoConvencion: string = 'documentos';

  constructor(
    private _appComponent: AppComponent
    , private _archivoService: ArchivoService
    , private _convencionService: ConvencionService
    , private _helper: Helper
    , private _pagerService: PagerService
  ) { }

  ngOnInit() {
    const links: Navlink[] = [];
    this._appComponent.setLinks(links);

    this.cargarArchivos();

    this._convencionService.get()
          .subscribe(
            list => {
              this.convenciones = list;
              // console.log(this.convenciones);
            }
          )
      ;
  }

  public cargarArchivos(){
    this._archivoService.get()
          .subscribe(
            list => {
              this.archivos = list;
              this.allItems = this.archivos;
              // console.log(this.archivos);
              this.consultarArchivos();
            }
          )
      ;
  }

  setPage(page: number) {
    // console.log("Page:"+page+", this.allItems.length:"+this.allItems.length);
    if (page < 1) {
    // if (page < 1 || page > this.pager.totalPages) {
        // console.log("Página: "+page.toString()+", Total Páginas: "+this.pager.totalPages);
        return;
    }
    this.pager = this._pagerService.getPager(this.allItems.length, page, 5);
    // console.log(this.pager);
    this.pagedItems = this.allItems.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }
  consultarArchivos() {

    let archivos: Archivo[] = this.archivos
    // console.log('Convencion: '+this.convencion);
    
    if(this.convencion.length>0) {
      switch(this.convencion) {
    case 'M':
        this.textoConvencion = 'manuale(s)'
        break;
    case 'P':
        this.textoConvencion = 'procedimiento(s)'
        break;
    case 'I':
        this.textoConvencion = 'instructivo(s)'
        break;
     case 'F':
        this.textoConvencion = 'formato(s)'
        break;
    default:
        this.textoConvencion = 'documentos';
}
      archivos = [];
      const convencionid = this.convencion;
      this.archivos.forEach(function(archivo) {
        if(archivo.convencionid === convencionid){
          archivos.push(archivo);
        }
      });
      // console.log(archivos.length);
    }

    this.filtro = this.filtroAux;
    const startTime = new Date();
    const startMsec = startTime.getMilliseconds();

        // console.log("Filtro:"+this.filtro);
        this.allItems = archivos;
        if(this.filtro === '' && this.filtro !== ''){
          this.setPage(1);

          return;
        }

        const re = new RegExp(this.filtro.toLowerCase(), 'g');
        const ss = archivos;
        const matches = ss.filter(function(s) {
            const concat = s.archivoid.concat(s.denominacion).concat(s.archivoidaux).concat(s.convencion).toLowerCase();
            return concat.toLowerCase().match(re);
        });
        this.allItems = matches;


        // this.allItems = [];
        // const palabras = this.filtro.toLowerCase().split(' ');
        // console.log(palabras);
        // this.archivos.forEach(function(archivo) {
        //   // console.log(archivo);
        //   palabras.forEach(function(palabra){
        //     if(palabra.indexOf(archivo.denominacion) > 0){
        //       // this.allItems.push(archivo);
        //       console.log(archivo);
        //     }
        //   });
        // });


        if ( this.allItems.length <= 0 ) {
            this.message = 'Has escrito (' + this.filtro;
            this.message += ') y el o los registros que contienen ese texto como nombre no están disponibles en este momento';
        }else {
            this.message = '';
        }
        // console.log(this.allItems.length);
        // console.log(this.pager);
        // console.log(this.pagedItems);
        this.setPage(1);
        // console.log(this.allItems);
    const elapsed = (startTime.getTime() - startMsec) / 1000;
    this.intervalo = elapsed;
  }



}
