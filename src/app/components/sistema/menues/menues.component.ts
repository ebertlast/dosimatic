import { Component, OnInit } from '@angular/core';
import { Menu } from 'app/models/menu';
import { Ruta } from 'app/models/ruta';
import { Navlink } from 'app/models/navlink';
import { MenuesService } from 'app/services/sistema/menues.service';
import { RutasService } from 'app/services/seguridad/rutas.service';
import { AppComponent } from 'app/app.component';
import { Helper } from 'app/helpers/helper';

declare var $:any;
declare var swal:any;

@Component({
  selector: 'app-menues',
  templateUrl: './menues.component.html',
  styleUrls: ['./menues.component.css']
})

export class MenuesComponent implements OnInit {
  public menues:Menu[]=[];
  public rutas:Ruta[]=[];
  public model:Menu=new Menu("","","",1,true,"","","","",false);
  public nuevo:boolean=true;
  public title:string;
  public menuidOLD:string;
  constructor(
    private _menuesService:MenuesService,
    private _helper:Helper,
    private _rutasService:RutasService,
    private _appComponent:AppComponent
  ) { 
    this.obtenerRutas();
    this.recargarMenues();
    this.setAccion();
  }

  ngOnInit() {
    $("#orden").TouchSpin({
      verticalbuttons: false,
      buttondown_class: 'btn btn-white',
      buttonup_class: 'btn btn-white'
    });

    let links:Navlink[]=[
      {url:"/menues",title:"Menues del Sistema",active:true},
      ];
    this._appComponent.setLinks(links);
  }
  public setAccion(nuevo:boolean=true){
    this.nuevo=nuevo;
    if(nuevo){
      this.title="Nuevo menú";
      this.menuidOLD="";
      this.model=new Menu("","","",1,true,"","","","",false);
    }else{
      this.title="Actualizar menú";
      let encontrado=false;
      if(this.model.menuid!=='')
        this.menuidOLD=this.model.menuid;
        this.menues.forEach(menu=>{
          if(!encontrado)
            if(this.model.menuid===menu.menuid){
              this.model=menu;
              this.title="Actualizar datos de "+this.model.label;
              encontrado=true;
            }
        });
    }
  }
  public editar(menuid:string){
    this.model=new Menu(menuid,"","",1,true,"","","","",false);
    this.setAccion(false);
  }
  public recargarMenues(){
      this._menuesService.getAllMenues()
          .subscribe(
            menues => {
              // console.log(menues);
              this.menues=menues;
            }
          );
  }
  public obtenerRutas(){
      this._rutasService.rutas()
          .subscribe(
            rutas => {
              // console.log(rutas);
              this.rutas=rutas;
            }
          );
  }
  private formValido():boolean{
    let valido:boolean=true;
    if(this.model.menuid===''){
      this._helper.notificationToast("El identificador es obligatorio","Valores incompletos","error");
      valido=false;
    }
    if(valido)
      if(this.model.label===''){
        this._helper.notificationToast("El campo label (Texto a ser mostrado) es obligatorio","Valores incompletos","error");
        valido=false;
      }
    if(valido)
      if(this.model.orden.toString()===''){
        this._helper.notificationToast("Debes indicar en que orden sera mostrado el menu","Valores incompletos","error");
        valido=false;
      }
    if(valido)
      if(this.nuevo){
        this.menues.forEach(menu=>{
          if(valido)
            if(menu.menuid===this.model.menuid){
              
              valido=false;
              this._helper.notificationToast("Existe un menú con el mismo codigo con el cual intentas registrar de nuevo","Validación","error");
            }
        });
      }    
    return valido;
  }

  
  public eliminar(){

    let eliminar:boolean=false;
    let _this:MenuesComponent=this;
    swal({
        title: "¿Confirma que desea eliminar el menu '"+this.model.label+"'?",
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
          if(_this.model.menuid!=="")
            _this._menuesService.delMenu(_this.model.menuid)
                .subscribe(
                  success => {
                    if(success===true){
                      swal("¡Perfil eliminado!", "El perfil '"+_this.model.label+"' ha sido eliminado de la base de datos satisfactoriamente.", "success");
                      _this.recargarMenues();
                      _this.setAccion();
                    }
                  }
                );
          /*********************************************************** */
          
        } else {
        //     swal("Cancelado", "Cancelado por el usuario)", "error");
        }
    },_this);
  }
  public onSubmit(){
    // console.log(this.model);
    // console.log(this.formValido());
    if(this.formValido())
    {
      if(this.nuevo){
        this._menuesService.addMenu(this.model)
            .subscribe(
              success => {
                if(success===true){
                  this.recargarMenues();
                  this.setAccion();
                }
              }
            );
      }else{
        if(this.menuidOLD!=="")
          this._menuesService.editMenu(this.menuidOLD,this.model)
              .subscribe(
                success => {
                  if(success===true){
                    this.recargarMenues();
                  }
                }
              );
      }
    }
    return false;
  }

}
