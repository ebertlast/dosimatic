import { Component, OnInit } from '@angular/core';
import { AppComponent } from 'app/app.component';
import { Helper } from 'app/helpers/helper';
import { Navlink } from 'app/models/navlink';
import { Perfil } from 'app/models/perfil';
import { Usuario } from 'app/models/usuario';
import { Ruta } from 'app/models/ruta';
import { PerfilesService } from 'app/services/seguridad/perfiles.service';
import { UsuariosService } from 'app/services/seguridad/usuarios.service';
import { RutasService } from 'app/services/seguridad/rutas.service';
import { environment } from '../../../../../../environments/environment';
import { Router, ActivatedRoute, Params  } from '@angular/router';

declare var $:any;
declare var btn:any;
declare var swal:any;
@Component({
  selector: 'app-perfil-view',
  templateUrl: './perfil-view.component.html',
  styleUrls: ['./perfil-view.component.css']
})
export class PerfilViewComponent implements OnInit {
	public perfil:Perfil=new Perfil("","",false,null);
	public usuarios:Usuario[]=[];
	public usuariosFiltrados:Usuario[]=[];
	public rutas:Ruta[]=[];
	public rutasFueraDelPerfil:Ruta[]=[];
	public rutasEnPerfil:Ruta[]=[];
	public usuarioAgregar:string;
	public rutaElegida:string;
	constructor(
		private _appComponent:AppComponent,
	    private _perfilesService:PerfilesService,
	    private _usuariosService:UsuariosService,
	    private _router:Router,
	    private _activatedRoute:ActivatedRoute,
	    private _helper:Helper,
	    private _rutasService:RutasService
		) { }

	ngOnInit() {
		this.getPerfil();
	}
	private refrescarNavegacion(){
		let links:Navlink[]=[{url:"perfiles",title:"Perfiles",active:false},{url:"",title:"Perfil "+this.perfil.denominacion,active:true}];
		this._appComponent.setLinks(links);
		if(!environment.production){
		  // console.log("[perfil-view.component.ts] perfil:");
		  // console.log(this.perfil);
		}
	}

	public obtenerRutas(){
		/************************** */
		this._rutasService.rutas()
		  .subscribe(
		    rutas => {
		      // console.log("1.- Todas las rutas");
		      // console.log(this.rutas);

		      this.rutas=rutas;
		      
		    }
		  );    
		/************************** */
	}

	public RefrescarRutas(){
		this._rutasService.rutasEnPerfil(this.perfil.perfilid)
		    .subscribe(
		      rutas => {
		        this.rutasEnPerfil=rutas;
		        // console.log("2.- Rutas en perfil");
		        // console.log(this.rutasEnPerfil);
		        
		        this.rutasFueraDelPerfil=[];
		        this.rutas.forEach(ruta => {
		          // if(this.rutasEnPerfil.indexOf(ruta)<0){
		          //   console.log(ruta.descripcion+" INGRESADA AL LISTADO");
		          //   this.rutasFueraDelPerfil.push(ruta);
		          // }
		          // console.log(ruta.rutaid);
		          let existe:boolean=false;
		          this.rutasEnPerfil.forEach(element => {
		            if(ruta.rutaid===element.rutaid)
		              existe=true;
		          });
		          if(!existe)
		            this.rutasFueraDelPerfil.push(ruta);
		        });
		        // console.log("3.- Rutas fuera del perfil");
		        // console.log(this.rutasFueraDelPerfil);
		      }
		    );
	}

	public getPerfil(){
		let _perfilId:string;
		this._activatedRoute.params.forEach((params:Params)=>{
		  _perfilId=params["perfilid"];
		});
		// console.log(_perfilId);
		if(_perfilId!=="")
		  this._perfilesService.getPerfil(_perfilId)
		      .subscribe(
		        perfil => {
		           if(!environment.production){
		            // console.log("[perfil-view.component.ts](getPerfil) Response:");
		            // console.log(perfil[0]);
		          }
		          this.perfil=perfil;
		          if(!environment.production){
		            // console.log("[perfil-view.component.ts](getPerfil) this.perfil: ");
		            // console.log(this.perfil);
		          }             
		          this.refrescarNavegacion();
		          if(this.perfil.perfilid!==""){
		            this.getUsuariosEnPerfil();
		            this.obtenerRutas();
		            this.RefrescarRutas();
		          }
		        }
		      );
	}
	public eliminarPerfil(){

    let eliminar:boolean=false;
    let _this:PerfilViewComponent=this;
    swal({
        title: "¿Confirma que desea eliminar el perfil '"+this.perfil.denominacion+"'?",
        text: "¡Esta acción no podrá deshacerse una vez que usted haya confirmado su decisión!",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#18A689",
        confirmButtonText: "¡Por supuesto!",
        cancelButtonText: "Cancelar",
        closeOnConfirm: false,
        closeOnCancel: true },
    function (isConfirm) {
        /*Si el usuario ha confirmado la eliminacion */
        if (isConfirm) {
          /*********************************************************** */
          if(_this.perfil.perfilid!=="")
            _this._perfilesService.delPerfil(_this.perfil.perfilid)
                .subscribe(
                  success => {
                    if(success===true){
                      swal("¡Perfil eliminado!", "El perfil '"+_this.perfil.denominacion+"' ha sido eliminado de la base de datos satisfactoriamente.", "success");
                      _this._router.navigate(['/perfiles']);
                    }
                  }
                );
          /*********************************************************** */
          
        } else {
        //     swal("Cancelado", "Cancelado por el usuario)", "error");
        }
    },_this);
  }

  public clickEventHandlerTab(tab:string){
    // console.log(tab);
    (<HTMLElement>document.querySelector("#tabUsuarios")).setAttribute("class","oculto");
    (<HTMLElement>document.querySelector("#tabPermisos")).setAttribute("class","oculto");
    (<HTMLElement>document.querySelector(tab)).setAttribute("class","tab-pane active");

    (<HTMLElement>document.querySelector("#headertabUsuarios")).setAttribute("class","");
    (<HTMLElement>document.querySelector("#headertabPermisos")).setAttribute("class","");
    (<HTMLElement>document.querySelector("#header"+tab.replace("#",""))).setAttribute("class","active");
  }

  public getUsuariosEnPerfil(){
    let _perfilId:string=this.perfil.perfilid;
    // console.log(_perfilId);
    if(_perfilId!=="")
      this._usuariosService.getUsuariosEnPerfil(_perfilId)
          .subscribe(
            usuarios => {
               if(!environment.production){
                // console.log("[perfil-view.component.ts](getUsuariosEnPerfil) Response:");
                // console.log(usuarios);
              }
              this.usuarios=usuarios;
              
              this._helper.revisarAvatarsDeUsuarios(this.usuarios);
              if(!environment.production){
                // console.log("[perfil-view.component.ts](getUsuariosEnPerfil) this.usuarios: ");
                // console.log(this.usuarios);
              }
            }
          );
   this.cargarUsuariosFiltrados();
  }

  /**
   * Carga usuarios que no estan subscritos al perfil
   */
  public cargarUsuariosFiltrados(){
    let _perfilId:string=this.perfil.perfilid;
      this._usuariosService.getUsuariosFueraDelPerfil(_perfilId)
          .subscribe(
            usuarios => {
              this.usuariosFiltrados=usuarios;
              
              this._helper.revisarAvatarsDeUsuarios(this.usuariosFiltrados);
              
              if(!environment.production){
                // console.log("[perfil-view.component.ts](cargarUsuariosFiltrados) this.usuariosFiltrados: ");
                // console.log(this.usuariosFiltrados);
              }

            }
          );
  }

  public asignarPerfil(){
    if(this.usuarioAgregar===""){
      $('#usuarioPerfil').focus();
      return; 
    }
    if(this.usuarioAgregar!==""&&this.perfil.perfilid!=="")
      this._usuariosService.asignarPerfil(this.usuarioAgregar,this.perfil.perfilid)
          .subscribe(
            response => {
              this.getUsuariosEnPerfil();
              this.usuarioAgregar="";
            }
          );
  }

  public desvincularPerfil(usuario:string){
    if(usuario!=="")
      this._usuariosService.quitarPerfil(usuario,this.perfil.perfilid)
          .subscribe(
            response => {
              this.getUsuariosEnPerfil();
            }
          );
  }

  public agregarPermisoARuta(){
    // console.log(this.rutaElegida);
    if(this.rutaElegida===''||this.rutaElegida===null){
      return;
    }
    if(this.perfil.perfilid!=="")
      this._perfilesService.agregarRutaAPerfil(this.perfil.perfilid,this.rutaElegida)
          .subscribe(
            response => {
              this.RefrescarRutas();
              // if(this._appComponent.currentUser.perfilid===this.perfil.perfilid){
              //   this._appComponent.refrescarMenues();
              // }
            }
          );
    
  }
  public quitarPermisoARuta(rutaid:string){
    if(this.perfil.perfilid!=="")
      this._perfilesService.quitarRutaAPerfil(this.perfil.perfilid,rutaid)
          .subscribe(
            response => {
              this.RefrescarRutas();
              // if(this._appComponent.currentUser.perfilid===this.perfil.perfilid){
              //   this._appComponent.refrescarMenues();
              // }
            }
          );
    
  }
}
