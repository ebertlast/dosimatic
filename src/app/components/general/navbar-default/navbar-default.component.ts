import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Usuario } from 'app/models/usuario';
import { app } from '../../../../environments/environment';
import { Menu } from 'app/models/menu';
import { Helper } from 'app/helpers/helper';
import { MenuesService } from 'app/services/sistema/menues.service';
import { Router } from '@angular/router';
declare var jQuery:any;
@Component({
  selector: 'app-navbar-default',
  templateUrl: './navbar-default.component.html',
  styleUrls: ['./navbar-default.component.css']
})
export class NavbarDefaultComponent implements OnInit, OnChanges {
  @Input()
  usuario:Usuario=new Usuario();
  app=app;
  private menues:Menu[]=[];
  /*************************************/
  private _seguridad:boolean=false;
  private _usuarios:boolean=false;
  private _perfiles:boolean=false;
  private _menues:boolean=false;
  private _gestiondocumental:boolean=false;
  private _archivos:boolean=false;
  private _gestion:boolean=false;
  /*************************************/
  
  constructor(
    private _helper:Helper
    ,private _menuesService:MenuesService
    ,private _router:Router
  ) {
   }
  ngOnChanges(changes: SimpleChanges) {
    // console.log("Cambios:");
    // console.log(changes);
    this.recargarMenues(this.usuario);
  }
  // public refrescar(){
  //   console.log("Desde navbar-default:");
  //   console.log(this.usuario);
  // }
  ngOnInit() {
  }

  public recargarMenues(usuario:Usuario):void{
    if(usuario===null || usuario.usuario===""){  
      return;
    }

    this._seguridad=false;
    this._usuarios=false;
    this._perfiles=false;
    this._menues=false;


    this._gestiondocumental=false;
    this._archivos=false;
    this._gestion=false;

    this.menues=[];
    this._menuesService.getMenues(this.usuario.usuario)
          .subscribe(
            menues => {
              this.menues=menues;
              this.menues.forEach(menu=>{
                switch (menu.menuid) {
                  case "seguridad":
                    this._seguridad=true;
                    break;
                  case "usuarios":
                    this._usuarios=true;
                    break;
                  case "perfiles":
                    this._perfiles=true;
                  case "menues":
                    this._menues=true;
                    break;
                  case "archivos":
                    this._gestiondocumental=true;
                    this._archivos=true;
                    break;
                  case "gestion":
                    this._gestiondocumental=true;
                    this._gestion=true;
                    break;
                  default:
                    break;
                }
              });

              // console.log(this.menues);
              // console.log("Seguridad: "+this._seguridad);
            }
          );
  }


}
