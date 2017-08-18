import { Component, OnInit } from '@angular/core';
import { Navlink as Link} from 'app/models/navlink';
import { Archivo, Usuario, Aprobacion } from 'app/models/index';
import { Revision } from 'app/models/revision';
import { AppComponent } from 'app/app.component';
import { Helper } from 'app/helpers/helper';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ArchivoService } from 'app/services/modulos/archivos/archivo.service';
import { AprobacionService } from 'app/services/modulos/archivos/aprobacion.service';
import { AutenticacionService } from 'app/services/seguridad/autenticacion.service';
import { UsuariosService } from 'app/services/seguridad/usuarios.service';
import { RevisionService } from 'app/services/modulos/archivos/revision.service';
import { app } from '../../../../../environments/environment';
import * as moment from 'moment';
// import { FechacortaPipe } from '../../../../pipes/fechacorta.pipe';
// import moment = require("moment");

declare var $: any;
declare var swal: any;
@Component({
  selector: 'app-archivo-view',
  templateUrl: './archivo-view.component.html',
  styleUrls: ['./archivo-view.component.css']
})
export class ArchivoViewComponent implements OnInit {
  public archivo: Archivo= new Archivo();
  public archivoEditable: Archivo = new Archivo();
  public app= app;
  public usuarios: Usuario[]= [];
  public aprobaciones: Aprobacion[]= [];
  public revisiones: Revision[]= [];
  public fdesde= '';
  public fhasta= '';
  public me: string;

  public botonesAprobacion = true;
  public botonesRevision = true;
  public aprobado = false;
  public revisado = false;

  public archivos: Archivo[] = [];
  public archivoFuente = false;

  public enableDelete = false;
  public uploading = false;
  public cantidadArchivos: number = 1;
  constructor(
    private _activatedRoute: ActivatedRoute,
    private _appComponent: AppComponent,
    private _helper: Helper,
    private _archivoService: ArchivoService,
    private _usuariosService: UsuariosService,
    private _aprobacionService: AprobacionService,
    private _revisionService: RevisionService,
    private _autenticacionService: AutenticacionService,
    // private _router:Router
    // private _fechaCortaPipe: FechacortaPipe
    ) {
    this.me = this._autenticacionService.usuario.usuario;
  }

  ngOnInit() {
    this.getArchivo();
    this.refreshUsuarios();

    //  $('input[name="daterange"]').daterangepicker();
    $('#fechaexp').datepicker({
      startView: 2,
      todayBtn: 'linked',
      keyboardNavigation: false,
      forceParse: false,
      autoclose: true
    });
    // $('#fhasta').datepicker({
      //     startView: 2,
      //     todayBtn: 'linked',
      //     keyboardNavigation: false,
      //     forceParse: false,
      //     autoclose: true
      // });

      $('#fechaexp').on('change', () => {
        // console.log($('#fechaexp').val());
        const fecha = $('#fechaexp').val();
        const separators = ['\\.', '\\-', '\\/'];
        const bits = fecha.split(new RegExp(separators.join('|'), 'g'));
        const yyyy = bits[2];
        const mm = bits[1];
        const dd = bits[0];
        // alert(dd + '/' + mm + '/' + yyyy);
        this.archivo.fechaexp = new Date(yyyy, mm, dd);

        // console.log(this.archivo);

        this._archivoService.edit(this.archivo.archivoid, this.archivo)
        .subscribe(
          actualizado => {
            if (actualizado) {
              // this.archivo.fechaexp = $('#fechaexp').val();
            }
          }
          );
      });
      // $('#fhasta').on('change',()=>{
        //     // this.validaciones();
        //     console.log($('#fdesde').val());
        // });
        this.getArchivos();
      }
      getArchivos() {
        this.archivos = [];
        this._archivoService.get()
        .subscribe(
          list => {
            list.forEach(archivo => {
              if ( (archivo.archivoidaux === this.archivo.archivoid)
                && archivo.archivoid !== this.archivo.archivoid && archivo.archivoidaux !== '' ) {
                // console.log(archivo.archivoid);

              this.archivos.push(archivo);
            }
          });
            // console.log(this.archivos);
            // this.archivos = list;
          }
          );
      }
      setLinks() {
        const links: Link[] = [
        {url: '', title: 'Gestión Documental', active: true},
        {url: '/archivos', title: 'Documentos', active: false},
        {url: '', title: this.archivo.denominacion, active: true},
        ];
        this._appComponent.setLinks(links);
      }
      getArchivo() {
        let _archivoid: string;
        this._activatedRoute.params.forEach((params: Params) => {
          _archivoid = params['archivoid'];
        });

        if (_archivoid !== ''){
          this._archivoService.get(_archivoid)
          .subscribe(
            archivo => {
              this.archivo = archivo[0];
              // console.log(this.archivo);
              const fechaexp = new Date(this.archivo.fechaexp);
              $('#fechaexp').val(fechaexp.getDate() + '/' + fechaexp.getMonth() + '/' + fechaexp.getFullYear());
              if (this.archivo.nombre.indexOf('.pdf') < 0 ) {
                this.archivoFuente = true;
                this.archivoFuente = false;
              }
              if(this.archivo.usuario === this.me){
                this.enableDelete = true;
              }
              this.setLinks();
              this.getAprobaciones();
              this._archivoService.get('AF__'+this.archivo.archivoid)
              // this._archivoService.get(this.archivo.archivoid,true)
              .subscribe(archivos => {
                let archivoEditable=this.archivoEditable;
                // console.log(archivos);
                archivos.forEach(function(archivo){
                  archivoEditable = archivo;
                });
                this.archivoEditable=archivoEditable;
                // console.log('Archivo Editable:' );
                // console.log( this.archivoEditable);
                // console.log(this.archivoEditable.nombre.split('.')[this.archivoEditable.nombre.split('.').length-1])
                this.cantidadArchivos = (this.archivoEditable.archivoid!=='') ? 2 : 1;
              });
            }
            );
          this._archivoService.get(_archivoid,true)
          .subscribe(archivo => {

          });
        } else {
          this._helper.goBack();
        }
      }
      refreshUsuarios() {
        this._usuariosService.getUsuarios()
        .subscribe(
          usuarios => {
            this.usuarios = usuarios;
            this._helper.revisarAvatarsDeUsuarios(this.usuarios);
            // console.log(this.usuarios);
          }
          );
        //  this.cargarUsuariosFiltrados();
      }
      getAprobaciones() {
        this.botonesAprobacion = true;
        this.aprobaciones = [];
        this._aprobacionService.get(this.archivo.archivoid)
        .subscribe(
          aprobaciones => {
            this.aprobaciones = aprobaciones;
            // console.log(this.aprobaciones);
            this.aprobaciones.forEach(aprobacion => {
              this.usuarios.forEach(usuario => {
                if (usuario.usuario === aprobacion.usuario) {
                  const index: number = this.usuarios.indexOf(usuario);
                  this.usuarios.splice(index, 1);
                  if (this._autenticacionService.usuario.usuario === usuario.usuario) {
                    this.botonesAprobacion = false;
                    this.aprobado = aprobacion.aprobado;
                    console.log('Aprobado:' + this.aprobado);
                  }
                }
                
              });
            });
          }
          );
        this.getRevisiones();
      }
      addAprobador() {
        const usuario = $('#aprobador').val();
        if (!usuario) { return; }
        const model: Aprobacion = new Aprobacion();
        model.archivoid = this.archivo.archivoid;
        model.usuario = usuario;
        this._aprobacionService.add(model)
        .subscribe(
          success => {
            if (success) { this.getAprobaciones(); }
          }
          );
      }
      delAprobacion(aprobacionid: string) {
        const eliminar = false;
        const _this: ArchivoViewComponent = this;
        swal({
          title: '¿Confirma que desea eliminar el registro?',
          text: '¡Esta acción no podrá deshacerse una vez que usted haya confirmado su decisión!',
          type: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#18A689',
          confirmButtonText: '¡Por supuesto!',
          cancelButtonText: 'Cancelar',
          closeOnConfirm: false,
          closeOnCancel: true },
          function (isConfirm) {
            /*Si el usuario ha confirmado la eliminacion */
            if (isConfirm) {
              /*********************************************************** */
              if (aprobacionid !== '') {
                _this._aprobacionService.del(aprobacionid)
                .subscribe(
                  success => {
                    if (success === true){
                      _this.getAprobaciones();
                      // _this.refreshUsuarios();
                      swal('¡Registro eliminado!', 'El registro ha sido eliminado de la base de datos satisfactoriamente.', 'success');
                    }
                  }
                  );
              }
              /*********************************************************** */
            }
          }, _this);
      }
      aprobar(archivoid: string) {
        this._aprobacionService.aprobar(archivoid)
        .subscribe(
          success => {
            // console.log(success);
            // if (success === true) {
              this.getAprobaciones();
              // _this.refreshUsuarios();
              // }
            }
            );
      }
      desaprobar(archivoid: string) {
        this._aprobacionService.aprobar(archivoid, false)
        .subscribe(
          success => {
            // if(success===true){
              this.getAprobaciones();
              // _this.refreshUsuarios();
              // }
            }
            );
      }
      download(archivoid: string) {
        this._archivoService.download(archivoid)
        .subscribe(
          data => {
            // console.log(data);
            window.open(app.apiurl + data.filename);
            // this.downloadFile(data);
            // console.log(data);
          }
          );
      }
      downloadFile(data: Response) {
        const blob = new Blob([data], { type: 'pdf' });
        const url = window.URL.createObjectURL(blob);
        window.open(url);
      }
      delDocumento(archivoid: string) {
        const _this: ArchivoViewComponent = this;
        swal({
          title: '¿Confirma que desea eliminar el registro?',
          text: '¡Esta acción no podrá deshacerse una vez que usted haya confirmado su decisión!',
          type: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#18A689',
          confirmButtonText: '¡Por supuesto!',
          cancelButtonText: 'Cancelar',
          closeOnConfirm: false,
          closeOnCancel: true },
          function (isConfirm) {
            /*Si el usuario ha confirmado la eliminacion */
            if (isConfirm) {
              if (archivoid !== '') {
                _this._archivoService.del(archivoid)
                .subscribe(
                  success => {
                    if(success === true) {
                      swal('¡Registro eliminado!', 'El registro ha sido eliminado de la base de datos satisfactoriamente.', 'success');
                      _this._helper.goBack();
                    }
                  }
                  );
              }
            }
          }, _this);
      }
      getRevisiones() {
        this.botonesRevision = true;
        this.revisiones = [];
        this._revisionService.get(this.archivo.archivoid)
        .subscribe(
          revisiones => {
            this.revisiones = revisiones;
            // console.log('Revisiones: ');
            // console.log(this.revisiones);
            this.revisiones.forEach(revision => {
              // console.log(revision);
              this.usuarios.forEach(usuario => {
                // console.log(usuario);
                if (usuario.usuario === revision.usuario) {
                  const index = this.usuarios.indexOf(usuario);
                  this.usuarios.splice(index, 1);

                  if (this._autenticacionService.usuario.usuario === usuario.usuario) {
                    // console.log(this.usuarios);
                    this.botonesRevision = false;
                    this.revisado = revision.revisado;
                    console.log('Revisado:' + this.revisado);

                  }
                }
              });
            });
            // console.log(this.usuarios);
          }
          );
      }
      addRevisor() {
        const usuario = $('#revisor').val();
        if (!usuario) { return; }
        const model: Revision = new Revision();
        model.archivoid = this.archivo.archivoid;
        model.usuario = usuario;
        this._revisionService.add(model)
        .subscribe(
          success => {
            if (success) { this.getRevisiones(); }
          }
          );
      }
      delRevision(revisionid: string) {
        const eliminar = false;
        const _this: ArchivoViewComponent = this;
        swal({
          title: '¿Confirma que desea eliminar el registro?',
          text: '¡Esta acción no podrá deshacerse una vez que usted haya confirmado su decisión!',
          type: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#18A689',
          confirmButtonText: '¡Por supuesto!',
          cancelButtonText: 'Cancelar',
          closeOnConfirm: false,
          closeOnCancel: true },
          function (isConfirm) {
            /*Si el usuario ha confirmado la eliminacion */
            if (isConfirm) {
              /*********************************************************** */
              if (revisionid !== '') {
                _this._revisionService.del(revisionid)
                .subscribe(
                  success => {
                    // alert('');
                    if (success === true) {
                      _this.getRevisiones();
                      // _this.refreshUsuarios();
                      swal('¡Registro eliminado!', 'El registro ha sido eliminado de la base de datos satisfactoriamente.', 'success');
                    }
                  }
                  );
              }
              /*********************************************************** */
            }
          }, _this);
      }
      revisar(archivoid: string) {
        this._revisionService.revisar(archivoid, true)
        .subscribe(
          success => {
            this.getRevisiones();
          }
          );
      }
      desrevisar(archivoid: string) {
        this._revisionService.revisar(archivoid, false)
        .subscribe(
          success => {
            this.getRevisiones();
          }
          );
      }

      fileChangeEvent(filesInput: any,fuente:boolean = true) {        
        const files = filesInput.srcElement.files;
        if (files.length <= 0) {
          return;
        }
        const postData = {field1: 'field1', field2: 'field2'}; // Put your form data variable. This is only example.
        if(fuente){

          this.uploading = true;
          this._archivoService.upload(postData, files).then(nombre => {
            let archivoNuevo = this.archivo;
            archivoNuevo.nombre = nombre.toString();
            archivoNuevo.vinculadoa = this.archivo.archivoid;
            archivoNuevo.archivoid = 'AF__' + this.archivo.archivoid;
            archivoNuevo.denominacion = 'Archivo Fuente de ' + this.archivo.denominacion;
            if(this.archivoEditable.archivoid ===''){
              //No existe archivo fuente
              // console.log(archivoNuevo);
              this._archivoService.add(archivoNuevo)
              .subscribe(
                success => {
                  // console.log(success);
                  if (success === true) {
                    this._helper.notificationToast('Documento respaldado en la base de datos.', 'Gestión Documental');
                    this.getArchivo();                  
                  }
                }
                );
            }else{
              //Existe un archivo fuente y se necesita actualizar
              let archivoNuevo = this.archivoEditable;
              archivoNuevo.nombre = nombre.toString();

              // // today.setUTCDate();
              // const today = new Date();
              // const dd = today.getDate();
              // const mm = today.getMonth()+1; //January is 0!
              // const yyyy = today.getFullYear();
              // const hh = today.getHours()-4;
              // const min = today.getMinutes();
              // const seg = today.getSeconds();
              // const mil = today.getMilliseconds();            
              // archivoNuevo.fecha = new Date(yyyy+'-'+mm+'-'+dd+' '+hh+':'+min+':'+seg+':'+mil);
              // archivoNuevo.fechaexp = new Date((yyyy+2)+'-'+mm+'-'+dd+' '+hh+':'+min+':'+seg+':'+mil);
              // console.log(archivoNuevo.fecha);
              // console.log(archivoNuevo.fechaexp);
              this._archivoService.edit(this.archivoEditable.archivoid,archivoNuevo)
              .subscribe(
                success => {
                  // console.log(success);

                  if (success === true) {
                    this._helper.notificationToast('Documento respaldado en la base de datos.', 'Gestión Documental');
                    this.getArchivo();                  
                  }
                }
                );
            }
            this.uploading = false;

          });
        }else{

          this.uploading = true;
          this._archivoService.upload(postData, files).then(nombre => {

            let archivoNuevo = this.archivo;
            archivoNuevo.nombre = nombre.toString();

            this._archivoService.edit(this.archivo.archivoid,archivoNuevo)
            .subscribe(
              success => {
                // console.log(success);
                if (success === true) {
                  this._helper.notificationToast('Versión actualizada.', 'Gestión Documental');
                  this.getArchivo();                  
                }
              }
              );
            this.uploading = false;

          });
        }
        // console.log(files);
      }
    }
