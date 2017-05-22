import { Component, OnInit } from '@angular/core';
import { Navlink as Link} from 'app/models/navlink';
import { Archivo } from 'app/models/archivo';
import { Usuario } from 'app/models/usuario';
import { Aprobacion } from 'app/models/aprobacion';
import { AppComponent } from 'app/app.component';
import { Helper } from 'app/helpers/helper';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ArchivoService } from 'app/services/modulos/archivos/archivo.service';
import { AprobacionService } from 'app/services/modulos/archivos/aprobacion.service';
import { UsuariosService } from 'app/services/seguridad/usuarios.service';
import { app } from '../../../../../environments/environment';
declare var $:any;
declare var swal:any;
@Component({
  selector: 'app-archivo-view',
  templateUrl: './archivo-view.component.html',
  styleUrls: ['./archivo-view.component.css']
})
export class ArchivoViewComponent implements OnInit {
  public archivo:Archivo=new Archivo();
  public app=app;
  public usuarios:Usuario[]=[];
  public aprobaciones:Aprobacion[]=[];
  constructor(
    private _activatedRoute:ActivatedRoute,
    private _appComponent:AppComponent,
    private _helper:Helper,
    private _archivoService:ArchivoService,
    private _usuariosService:UsuariosService,
    private _aprobacionService:AprobacionService
  ) { }

  ngOnInit() {
    this.getArchivo();
    this.refreshUsuarios(); 
  }
  setLinks(){
    let links:Link[]=[
      {url:"",title:"Gestión Documental",active:true},
      {url:"/archivos",title:"Documentos",active:false},
      {url:"",title:this.archivo.denominacion,active:true},
      ];
    this._appComponent.setLinks(links);
  }
  getArchivo(){
    let _archivoid:string;
    this._activatedRoute.params.forEach((params:Params)=>{
      _archivoid=params["archivoid"];
    });

    if(_archivoid!=="")
    {
      this._archivoService.get(_archivoid)
          .subscribe(
            archivo => {
              this.archivo=archivo[0];
              // console.log(this.archivo);
              this.setLinks();
              this.getAprobaciones();
            }
          );
    }else{
      this._helper.goBack();
    }
  }
  
  refreshUsuarios(){
    this._usuariosService.getUsuarios()
        .subscribe(
          usuarios => {
            this.usuarios=usuarios;
            this._helper.revisarAvatarsDeUsuarios(this.usuarios);
            console.log(this.usuarios);
          }
        );
    //  this.cargarUsuariosFiltrados();
  }
  getAprobaciones(){
    this.aprobaciones=[];
    this._aprobacionService.get(this.archivo.archivoid)
        .subscribe(
          aprobaciones => {
            this.aprobaciones=aprobaciones;
            console.log("Aprobaciones: ");
            
            console.log(this.aprobaciones);

            this.aprobaciones.forEach(aprobacion => {
              this.usuarios.forEach(usuario => {
                if(usuario.usuario===aprobacion.usuario){
                  var index = this.usuarios.indexOf(usuario);
                  console.log(index);
                  this.usuarios.splice(index, 1);
                }
              });
              // var index = aprobaciones.indexOf(aprobacion);
              // console.log(index);
            });
          }
        );
  }
  addAprobador(){
    let usuario=$('#aprobador').val();
    if(!usuario)
      return;
    let model:Aprobacion=new Aprobacion();
    model.archivoid=this.archivo.archivoid;
    model.usuario=usuario
    this._aprobacionService.add(model)
        .subscribe(
          success => {
            if(success)
              this.getAprobaciones();
          }
        );
  }

  delAprobacion(aprobacionid:string){
    
     let eliminar:boolean=false;
    let _this:ArchivoViewComponent=this;
    swal({
        title: "¿Confirma que desea eliminar el registro?",
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
          if(aprobacionid!=="")
            _this._aprobacionService.del(aprobacionid)
                .subscribe(
                  success => {
                    if(success===true){
                      _this.getAprobaciones();
                      _this.refreshUsuarios();
                      swal("¡Registro eliminado!", "El registro ha sido eliminado de la base de datos satisfactoriamente.", "success");
                    }
                  }
                );
          /*********************************************************** */
        }
    },_this);


    // this._aprobacionService.del(aprobacionid)
    //   .subscribe(
    //     success=>{
    //       this.getAprobaciones();
    //       this.refreshUsuarios();
    //     }
    //   );
    
  }

  aprobar(archivoid:string){
    this._aprobacionService.aprobar(archivoid)
        .subscribe(
          success => {
            // if(success===true){
              this.getAprobaciones();
              // _this.refreshUsuarios();
            // }
          }
        );
  }
   desaprobar(archivoid:string){
    this._aprobacionService.aprobar(archivoid,false)
        .subscribe(
          success => {
            // if(success===true){
              this.getAprobaciones();
              // _this.refreshUsuarios();
            // }
          }
        );
  }
  public aprobar2(archivoid:string){

    let eliminar:boolean=false;
    let _this:ArchivoViewComponent=this;
    swal({
        title: "Indique su decisión de aprobación",
        text: "¡Antes de aprobar el deocumento asegúrese de que cumple con todos los reglamentos de publicación!",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#18A689",
        confirmButtonText: "Aprobar",
        cancelButtonText: "No Aprobar",
        closeOnConfirm: true,
        closeOnCancel: true },
    function (isConfirm) {
        /*Si el usuario ha confirmado la eliminacion */
        if (isConfirm) {
          /*********************************************************** */
            _this._aprobacionService.aprobar(archivoid)
                .subscribe(
                  success => {
                    console.log(success);
                    if(success==true){
                      alert("");
                      swal("Aprobaciones actualizadas", "El documento ha sido actualizado.", "success");
                    }
                  }
                );
          /*********************************************************** */
          
        } else {
          _this._aprobacionService.aprobar(archivoid,false)
                .subscribe(
                  success => {
                    if(success===true){
                      alert("");
                      
                      swal("Aprobaciones actualizadas", "El documento ha sido actualizado.", "success");
                    }
                  }
                );
        }
    },_this);
  }
  
  download(archivoid:string){
    this._archivoService.download(archivoid)
                .subscribe(
                  data => {
                    console.log(data);
                     window.open(app.apiurl+data.filename);
                    // this.downloadFile(data);
                    // console.log(data);
                  }
                );
  }

  downloadFile(data: Response){
    var blob = new Blob([data], { type: 'pdf' });
    var url= window.URL.createObjectURL(blob);
    window.open(url);
  }
}
