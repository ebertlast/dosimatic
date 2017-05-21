import { Component, OnInit } from '@angular/core';
import { Convencion } from 'app/models/convencion';
import { ConvencionService as Service} from 'app/services/modulos/archivos/convencion.service';
import { Helper } from 'app/helpers/helper';
import { Navlink } from 'app/models/navlink';
import { AppComponent } from 'app/app.component';
declare var swal:any;

@Component({
  selector: 'app-convencion',
  templateUrl: './convencion.component.html',
  styleUrls: ['./convencion.component.css']
})
export class ConvencionComponent implements OnInit {
  models:Convencion[]=[];
  nuevo:boolean=true;
  modelidOLD:string;
  model:Convencion=new Convencion();
  title:string="Nuevo Registro";
  constructor(
    private _modelService:Service,
    private _helper:Helper,
    private _appComponent:AppComponent
  ) { }

  ngOnInit() {

    let links:Navlink[]=[
      {url:"",title:"Gestión Documental",active:true},
      {url:"/menues",title:"Convenciones",active:true},
      ];
    this._appComponent.setLinks(links);


    this.refresh();
    
  }

  public refresh(){
    this._modelService.get()
		    .subscribe(
		      list => {
		        this.models=list;
		        // console.log("Convenciones: ");
		        // console.log(this.models);
		      }
		    );
  }

  public setAccion(nuevo:boolean=true){
    this.nuevo=nuevo;
    if(nuevo){
      this.title="Nuevo Registro";
      this.modelidOLD="";
      this.model=new Convencion();
    }else{
      this.title="Actualizar Registro";
      let encontrado=false;
      if(this.model.convencionid!=='')
        this.modelidOLD=this.model.convencionid;
        this.models.forEach(g=>{
          if(!encontrado)
            if(this.model.convencionid===g.convencionid){
              this.model=g;
              this.title="Actualizar datos de "+this.model.denominacion;
              encontrado=true;
            }
        });
    }
  }

  public editar(modelid:string){
    this.model=new Convencion(modelid,"");
    this.setAccion(false);
  }

  private formValido():boolean{
    let valido:boolean=true;
    if(this.model.convencionid===''){
      this._helper.notificationToast("El identificador es obligatorio","Valores incompletos","error");
      valido=false;
    }
    if(valido)
      if(this.model.denominacion===''){
        this._helper.notificationToast("El campo denominación es obligatorio","Valores incompletos","error");
        valido=false;
      }
    return valido;
  }

  public onSubmit(){
    if(this.formValido())
    {
      if(this.nuevo){
        this._modelService.add(this.model)
            .subscribe(
              success => {
                if(success===true){
                  this.refresh();
                  this.setAccion();
                }
              }
            );
      }else{
        if(this.modelidOLD!=="")
          this._modelService.edit(this.modelidOLD,this.model)
              .subscribe(
                success => {
                  if(success===true){
                    this.refresh();
                  }
                }
              );
      }
    }
    return false;
  }

  public eliminar(){
    let eliminar:boolean=false;
    let _this:ConvencionComponent=this;
    swal({
        title: "¿Confirma que desea eliminar el registro '"+this.model.denominacion+"'?",
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
          if(_this.model.convencionid!=="")
            _this._modelService.del(_this.model.convencionid)
                .subscribe(
                  success => {
                    if(success===true){
                      swal("¡Registro eliminado!", "El registro '"+_this.model.denominacion+"' ha sido eliminado de la base de datos satisfactoriamente.", "success");
                      _this.refresh();
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
}
