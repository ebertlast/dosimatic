import { Component, OnInit } from '@angular/core';
import { AppComponent } from 'app/app.component';
import { Helper } from 'app/helpers/helper';
import { Navlink } from 'app/models/navlink';
import { Perfil } from 'app/models/perfil';
import { PerfilesService } from 'app/services/seguridad/perfiles.service';
import { environment } from '../../../../../../environments/environment';
import { Router, ActivatedRoute, Params  } from '@angular/router';
declare var $:any;

@Component({
  selector: 'app-perfil-edit',
  templateUrl: './perfil-edit.component.html',
  styleUrls: ['./perfil-edit.component.css']
})
export class PerfilEditComponent implements OnInit {
  public perfil:Perfil=new Perfil();
  public denominacionOld:string;
  public perfilidOld:string;
  
  constructor(
	    private _appComponent:AppComponent,
	    private _perfilesService:PerfilesService,
	    private _activatedRoute:ActivatedRoute,
	    private _helper:Helper,
	    private _router:Router
  	) { 
	  	let _perfilId:string="";
	    this._activatedRoute.params.forEach((params:Params)=>{
	      _perfilId=params["perfilid"];
	    });
	    if (!_perfilId){
	        this._helper.notificationToast("No hemos podido identificar el código del perfil a editar","Perfiles","error");
	        this._router.navigate(["/perfiles"]);
	    }else{
	      this.getPerfil();
	    }
  }

  ngOnInit() {
  	$('.i-checks').iCheck({
        checkboxClass: 'icheckbox_square-green',
        radioClass: 'iradio_square-green',
      });
  }
  public getActivo(){
    return this._helper.getCheckedRadio("i-checks-activo");
  }
  public refrescarNavegacion(){
    // this._appComponent.setTitle("Editando Perfil "+this.perfil.denominacion);
    let links:Navlink[]=[
      {url:"usuarios",title:"Usuarios",active:false},
      {url:"perfiles",title:"Perfiles",active:false},
      {url:"perfil/"+this.perfil.perfilid,title:"Perfil "+this.perfil.denominacion,active:false},
      {url:"",title:"Edición",active:true}
      ];
    this._appComponent.setLinks(links);
    if(!environment.production){
      // console.log("[perfil-view.component.ts] perfil:");
      // console.log(this.perfil);
    }
  }
  public getPerfil(){
    let _perfilId:string;
    this._activatedRoute.params.forEach((params:Params)=>{
      _perfilId=params["perfilid"];
    });
    if(_perfilId!=="")
      this._perfilesService.getPerfil(_perfilId)
          .subscribe(
            perfil => {
               if(!environment.production){
                // console.log("[perfil-view.component.ts] Response:");
                // console.log(perfil[0]);
              }
              this.perfil=perfil;
              if(!environment.production){
                // console.log("[perfil-view.component.ts] this.perfil: ");
                // console.log(this.perfil);
              }
              this.perfilidOld=this.perfil.perfilid;
              this.denominacionOld=this.perfil.denominacion;
              
              // console.log(typeof this.perfil.activo);
              if(this.perfil.activo){
                this._helper.setCheckedRadio("i-checks-activo");                
              }else{
                this._helper.setCheckedRadio("i-checks-inactivo");                
              }
              this.refrescarNavegacion();
            }
          );
  }

  public onSubmit(){
    this.perfil.activo=this.getActivo();
    // this._helper.notificationToast("Datos del perfil actualizados","Éxito");
    // this._router.navigate(['/perfil',this.perfil.perfilid]);
    this.editPerfil();
    return false;
  }


  public editPerfil(){
    let _perfilId:string;
    _perfilId=this.perfilidOld;
    if(_perfilId!=="")
      this._perfilesService.editPerfil(_perfilId,this.perfil)
          .subscribe(
            response => {
              // console.log(response);
              // this._appComponent.setLoading();
            }
          );
  }

}
