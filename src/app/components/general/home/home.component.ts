import { Component, OnInit } from '@angular/core';
import { AppComponent } from 'app/app.component';
import { Navlink } from 'app/models/navlink';
import { Archivo } from 'app/models/archivo';
import { ArchivoService } from 'app/services/modulos/archivos/archivo.service';
import { PagerService } from 'app/services/general/pager.service';
import { Helper } from 'app/helpers/helper';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public archivos:Archivo[]=[];
  public filtro:string="";
  public message:string="";
  public allItems: Archivo[]=[];
  pager: any = {};
  pagedItems: Archivo[]=[];

  constructor(
    private _appComponent:AppComponent
    ,private _archivoService:ArchivoService
    ,private _helper:Helper
    ,private _pagerService: PagerService
  ) { }

  ngOnInit() {
    let links:Navlink[]=[];
    this._appComponent.setLinks(links);

    this.cargarArchivos();
  }
  
  public cargarArchivos(){
    this._archivoService.get()
          .subscribe(
            list => {
              this.archivos=list;
              this.allItems=this.archivos;
              console.log(this.archivos);
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
  consultarArchivos(){
        // console.log("Filtro:"+this.filtro);
        this.allItems=this.archivos;
        if(this.filtro==="" && this.filtro!==""){
          this.setPage(1);
          
          return;
        }
        var re = new RegExp(this.filtro.toLowerCase(), 'g');
        var ss = this.archivos;
        var matches = ss.filter(function(s) {
            let concat:string=s.archivoid.concat(s.denominacion).concat(s.archivoidaux).toLowerCase();
            return concat.toLowerCase().match(re);
        });
        this.allItems=matches;
        if(this.allItems.length<=0)
            this.message="Has escrito ("+this.filtro+") y el o los productos que contienen ese texto como nombre no están disponibles en este momento"        
        else
            this.message="";
        // console.log(this.allItems.length);
        // console.log(this.pager);
        // console.log(this.pagedItems);
        this.setPage(1);
        // console.log(this.allItems);
        
  }
}
