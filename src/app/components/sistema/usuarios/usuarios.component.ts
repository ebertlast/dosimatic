import { Component, OnInit } from '@angular/core';
import { AppComponent } from 'app/app.component';
import { Navlink } from 'app/models/navlink';
import { Usuario } from 'app/models/usuario';
import { UsuariosService } from 'app/services/seguridad/usuarios.service';
import { PagerService } from 'app/services/general/pager.service';
import { Helper } from 'app/helpers/helper';
import { environment } from '../../../../environments/environment';
declare var $:any;
@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {
  public usuarios:Usuario[]=[];
  public filtro:string="";
  public message:string;

  // array of all items to be paged
  public allItems: Usuario[]=[];
  // pager object
  pager: any = {};
  // paged items
  pagedItems: Usuario[]=[];
  constructor(private _appComponent:AppComponent,private _usuariosService:UsuariosService
    ,private _helper:Helper
    ,private _pagerService: PagerService) { this.cargarUsuarios(); }

  ngOnInit() {
    let links:Navlink[]=[
      {url:"/usuarios",title:"Usuarios",active:true},
      ];
    this._appComponent.setLinks(links);

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
  cargarUsuarios(){
      this._usuariosService.getUsuarios()
          .subscribe(
            usuarios => {
              this.usuarios=usuarios;
              this._helper.revisarAvatarsDeUsuarios(this.usuarios);
              this.consultarUsuarios();            
              if(!environment.production){
                // console.log("[usuarios.component.ts](cargarUsuarios) this.usuarios: ");
                // console.log(this.usuarios);
              }

              // console.log(this.usuarios.length);
              
            }
          );
  }
  
  consultarUsuarios(){
        // console.log("Filtro:"+this.filtro);
        this.allItems=this.usuarios;
        if(this.filtro==="" && this.filtro!==""){
          this.setPage(1);
          
          return;
        }
        var re = new RegExp(this.filtro.toLowerCase(), 'g');
        var ss = this.usuarios;
        var matches = ss.filter(function(s) {
            let concat:string=s.nombres.concat(s.apellidos).concat(s.usuario).concat(s.email).toLowerCase();
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
   
  cambiarStatus(usuario:string,activo:boolean=false){
    
    this._usuariosService.setStatus(usuario,activo)
        .subscribe(
          actualizado => {
            let entry:Usuario=null;
            let aux:number=-1;
            let i:number=0;
            if(actualizado){
              this.usuarios.forEach(function(u:Usuario){
                if(u.usuario==usuario){
                  entry=u;
                  entry.activo=activo
                  aux=i;
                }
                i++;
              });
              // console.log(aux);
              this.usuarios[aux]=entry;
              $('#'+usuario).addClass("active");
              
            }
            
          }
        );
  }
}
