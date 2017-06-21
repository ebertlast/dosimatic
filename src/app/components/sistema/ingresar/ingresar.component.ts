import { Component, OnInit } from '@angular/core';
import { AutenticacionService } from 'app/services/seguridad/autenticacion.service';
import { Usuario } from 'app/models/usuario';
import { Router } from '@angular/router';
import { Helper } from 'app/helpers/helper';
import { app } from '../../../../environments/environment';
import { AppComponent } from 'app/app.component';

declare var $: any;
declare var Lada: any;

@Component({
  selector: 'app-ingresar',
  templateUrl: './ingresar.component.html',
  styleUrls: ['./ingresar.component.css']
})
export class IngresarComponent implements OnInit {
  public model: Usuario = new Usuario();
  title = 'Bienvenido a ' + app.name;
  loading = false;
  constructor(
    private _autenticacionService: AutenticacionService,
    private _router: Router, private _helper: Helper,
    private _appComponent: AppComponent
  ) {
  }

  ngOnInit() {
    this._autenticacionService.logout();
    this._appComponent.setUsuario(new Usuario());
  }

  public onSubmit() {
    this.loading = true;
    this._autenticacionService.login(this.model.usuario, this.model.clave)
        .subscribe(result => {
            if (result === true) {
                this._router.navigate(['/']);
                this._appComponent.setUsuario(this._autenticacionService.usuario);
            } else {
                this._helper.animateDiv('formLogin', 'shake');
            }
        });
    this.loading = false;
    return false;
  }

}
