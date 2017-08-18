import { Component, OnInit } from '@angular/core';
import { Navlink } from 'app/models/navlink';
import { Usuario } from 'app/models/usuario';
import { Perfil } from 'app/models/perfil';
import { AppComponent } from 'app/app.component';
import { PerfilesService } from 'app/services/seguridad/perfiles.service';
import { UsuariosService } from 'app/services/seguridad/usuarios.service';
import { Helper } from 'app/helpers/helper';
import { Router } from '@angular/router';
declare var $: any;
@Component({
  selector: 'app-usuario-add',
  templateUrl: './usuario-add.component.html',
  styleUrls: ['./usuario-add.component.css']
})
export class UsuarioAddComponent implements OnInit {
  public model: Usuario;
  public perfiles: Perfil[] = [];
  public valids: string[] = [];
  public formOK: boolean = false;
  public usuariosRegistrados: Usuario[] = [];
  public confirmClave: string = '';
  constructor(private _appComponent: AppComponent,
    private _perfilesService: PerfilesService,
    private _usuariosService: UsuariosService,
    public _helper: Helper,
    private _router: Router) {
    this.model = new Usuario();

    /** C O M E N T A R */
    // this.model=new Usuario("pruebas","enclave","pruebas@pruebas.com",true,null,false,null,"Pablo","Medina",'',"admin","Administrador");
    // this.confirmClave="enclave";
    /** C O M E N T A R */

    this.cargarPerfiles();
    this.cargarUsuariosRegistrados();

    /**validaciones */
    this.valids['usuario'] = { error: '' };
    this.valids['email'] = { error: '' };
    this.valids['perfilid'] = { error: '' };
    this.valids['clave'] = { error: '' };
    this.valids['fechanacimiento'] = { error: '' };
    this.valids['nombres'] = { error: '' };
    this.valids['apellidos'] = { error: '' };
    /**fin validaciones */
  }

  ngOnInit() {
    $('.i-checks').iCheck({
      checkboxClass: 'icheckbox_square-green',
      radioClass: 'iradio_square-green',
    });
    let links: Navlink[] = [
      { url: "/usuarios", title: "Usuarios", active: false },
      { url: "/usuarioadd", title: "Nuevo Usuario", active: true },
    ];
    this._appComponent.setLinks(links);
    $('#fechanacimiento .input-group.date').datepicker({
      startView: 2,
      todayBtn: "linked",
      keyboardNavigation: false,
      forceParse: false,
      autoclose: true
    });

    $('#fechanacimiento .input-group.date').on('change', () => {
      this.validaciones();
    });
    // jQuery(this.elementRef.nativeElement).find('input').on('input', () => {
    //   this.onChange();
    // });
    // this.validaciones();
  }

  onSubmit() {
    // console.log(this.model);
    if (!this.formOK) {
      this._helper.notificationToast('Debes rellenar el formulario correctamente', 'Registro de usuarios', 'error');
      return false;
    }

    const separators = ['\\.', '\\-', '\\/'];
    const bits = this._helper.getFecha('fechanacimiento').split(new RegExp(separators.join('|'), 'g'));
    const yyyy: any = bits[2];
    const mm: any = bits[1];
    const dd: any = bits[0];
    this.model.fechanacimiento = new Date(yyyy, mm, dd);
    // console.log(this.model.fechanacimiento);
    let _perfilId: string;
    if (_perfilId !== '')
      this._usuariosService.addUsuario(this.model)
        .subscribe(
        registrado => {
          // console.log(registrado);
          if (registrado) {
            this._router.navigate(['/usuarios']);
          }
        }
        );

    return false;
  }

  private cargarPerfiles() {
    this._perfilesService.getPerfiles()
      .subscribe(
      perfiles => {
        this.perfiles = perfiles;
      }
      );
  }
  private cargarUsuariosRegistrados() {
    this._usuariosService.getUsuarios()
      .subscribe(
      usuarios => {
        // console.log(usuarios);
        this.usuariosRegistrados = usuarios;
      }
      );
  }
  public validaciones() {
    this.formOK = true;
    // console.log(this.model.perfilid);
    this.valids['usuario'] = { error: '' };
    this.valids['email'] = { error: '' };
    this.valids['perfilid'] = { error: '' };
    this.valids['clave'] = { error: '' };
    this.valids['fechanacimiento'] = { error: '' };
    this.valids['nombres'] = { error: '' };
    this.valids['apellidos'] = { error: '' };
    /**Perfil */
    if (this.model.perfilid === '') {
      this.valids['perfilid'] = { error: 'El perfil es un campo obligatorio' };
      this.formOK = false;
    }
    /**Nombre del Usuario */
    if (!this.formOK) return;
    if (this.model.usuario === '') {
      this.valids['usuario'] = { error: 'El usuario es un campo obligatorio' };
      this.formOK = false;
    } else {
      // this._usuariosService.getUsuario(this.model.usuario)
      //   .subscribe(
      //     usuario => {
      //       let u:Usuario=usuario;
      //       if(u.usuario){
      //         this.valids['usuario']={error:'Nombre de usuario no disponible'};
      //         this.formOK=false;
      //       }else{
      //         this.valids['usuario']={error:''};
      //       }
      //       this._appComponent.setLoading();
      //     }
      //   );
      this.valids['usuario'] = { error: '' };
      this.usuariosRegistrados.forEach(function (usuario: Usuario) {
        if (this.valids['usuario'].error === '')
          if (usuario.usuario === this.model.usuario) {
            this.valids['usuario'] = { error: 'Nombre de usuario no disponible' };
            this.formOK = false;
          }
      }, this);
    }
    /**email */
    if (!this.formOK) return;
    if (this.model.email === '') {
      this.valids['email'] = { error: "El correo es un campo obligatorio" };
      this.formOK = false;
    } else {
      if (this._helper.emailValido(this.model.email)) {
        this.usuariosRegistrados.forEach(function (usuario: Usuario) {
          if (this.valids['email'].error === '')
            if (usuario.email === this.model.email) {
              this.valids['email'] = { error: "Correo electrónico no disponible" };
              this.formOK = false;
            }
        }, this);
      } else {
        this.valids['email'] = { error: "Formato de correo electrónico inválido" };
      }
    }
    /**claves */
    if (!this.formOK) return;
    if (this.model.clave === '') {
      this.valids['clave'] = { error: "La contraseña es un campo obligatorio" }
      this.formOK = false;
    } else {
      if (this.model.clave !== this.confirmClave) {
        this.valids['clave'] = { error: "Las contraseñas no coinciden" }
        this.formOK = false;
      }
    }
    /**nombres */
    if (!this.formOK) return;
    if (this.model.nombres === '') {
      this.valids['nombres'] = { error: "Debes escribir al menos un nombre" }
      this.formOK = false;
    }
    /**apellidos */
    if (!this.formOK) return;
    if (this.model.apellidos === '') {
      this.valids['apellidos'] = { error: "Debes escribir al menos un apellido" }
      this.formOK = false;
    }
    /**fecha de nacimiento */
    if (!this.formOK) return;
    // let fechanacimiento: string = this._helper.getFecha("fechanacimiento");
    // console.log(fechanacimiento);

    // if (fechanacimiento === '') {
    //   this.valids['fechanacimiento'] = { error: "La fecha de nacimiento es obligatoria" }
    //   this.formOK = false;
    // } else {
    //   if (!this._helper.fechavalida(fechanacimiento)) {
    //     this.valids['fechanacimiento'] = { error: "Debes ingresar una fecha válida en formato dd/mm/aaaa" }
    //     this.formOK = false;
    //   } else {


    //   }
    //   // console.log(fechanacimiento);
    //   // console.log(this.model.fechanacimiento);
    // }
    // this.formOK=false;
    // console.log(this.formOK);
  }
}
