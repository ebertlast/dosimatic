import { Component, OnInit } from '@angular/core';
import { Gestion } from 'app/models/gestion';
import { GestionService } from 'app/services/modulos/archivos/gestion.service';
import { Helper } from 'app/helpers/helper';
import { Navlink } from 'app/models/navlink';
import { AppComponent } from 'app/app.component';
declare var swal: any;

@Component({
  selector: 'app-gestion',
  templateUrl: './gestion.component.html',
  styleUrls: ['./gestion.component.css']
})
export class GestionComponent implements OnInit {
  gestiones: Gestion[] = [];
  nuevo = true;
  gestionidOLD: string;
  gestion: Gestion = new Gestion();
  title = 'Nuevo Proceso';
  constructor(
    private _gestionService: GestionService,
    private _helper: Helper,
    private _appComponent: AppComponent
  ) { }

  ngOnInit() {
    const links: Navlink[] = [
      { url: '', title: 'Gestión Documental', active: true },
      { url: '/menues', title: 'Gestión de Procesos', active: true },
    ];
    this._appComponent.setLinks(links);
    this.cargarGestiones();
  }

  public cargarGestiones() {
    this._gestionService.gestiones()
      .subscribe(
      gestiones => {
        this.gestiones = gestiones;
        // console.log("Gestiones: ");
        // console.log(this.gestiones);
      }
      );
  }
  public setAccion(nuevo: boolean = true) {
    this.nuevo = nuevo;
    if (nuevo) {
      this.title = 'Nuevo Proceso';
      this.gestionidOLD = '';
      this.gestion = new Gestion();
    } else {
      this.title = 'Actualizar Proceso';
      let encontrado = false;
      if (this.gestion.gestionid !== '') {
        this.gestionidOLD = this.gestion.gestionid;
        this.gestiones.forEach(g => {
          if (!encontrado) {
            if (this.gestion.gestionid === g.gestionid) {
              this.gestion = g;
              this.title = 'Actualizar datos de   ' + this.gestion.denominacion;
              encontrado = true;
            }
          }
        });
      }
    }
  }

  public editar(gestionid: string) {
    this.gestion = new Gestion(gestionid, '');
    this.setAccion(false);
  }

  private formValido(): boolean {
    let valido = true;
    if (this.gestion.gestionid === '') {
      this._helper.notificationToast('El identificador es obligatorio', 'Valores incompletos', 'error');
      valido = false;
    }
    if (valido) {
      if (this.gestion.denominacion === '') {
        this._helper.notificationToast('El campo denominación es obligatorio', 'Valores incompletos', 'error');
        valido = false;
      }
    }
    return valido;
  }

  public onSubmit() {
    if (this.formValido()) {
      if (this.nuevo) {
        this._gestionService.addGestion(this.gestion)
          .subscribe(
          success => {
            if (success === true) {
              this.cargarGestiones();
              this.setAccion();
            }
          }
          );
      } else {
        if (this.gestionidOLD !== '') {
          this._gestionService.editGestion(this.gestionidOLD, this.gestion)
            .subscribe(
            success => {
              if (success === true) {
                this.cargarGestiones();
              }
            }
            );
        }
      }
    }
    return false;
  }

  public eliminar() {

    const _this: GestionComponent = this;
    swal({
      title: '¿Confirma que desea eliminar el proceso "' + this.gestion.denominacion + '"?',
      text: '¡Esta acción no podrá deshacerse una vez que usted haya confirmado su decisión!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#18A689',
      confirmButtonText: '¡Por supuesto!',
      cancelButtonText: 'Cancelar',
      closeOnConfirm: false,
      closeOnCancel: true
    },
      function (isConfirm) {
        /*Si el usuario ha confirmado la eliminacion */
        if (isConfirm) {
          /*********************************************************** */
          if (_this.gestion.gestionid !== '') {
            _this._gestionService.delGestion(_this.gestion.gestionid)
              .subscribe(
              success => {
                if (success === true) {
                  swal('¡Proceso eliminado!',
                    'El proceso "' + _this.gestion.denominacion + '" ha sido eliminado de la base de datos satisfactoriamente.',
                    'success');
                  _this.cargarGestiones();
                  _this.setAccion();
                }
              }
              );
          }
          /*********************************************************** */
        } else {
          //     swal("Cancelado", "Cancelado por el usuario)", "error");
        }
      }, _this);
  }
}
