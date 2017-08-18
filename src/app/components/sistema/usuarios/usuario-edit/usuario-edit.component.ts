import { Component, OnInit } from '@angular/core';
import { Navlink } from 'app/models/navlink';
import { Usuario } from 'app/models/usuario';
import { Perfil } from 'app/models/perfil';
import { AppComponent  } from 'app/app.component';
import { PerfilesService } from 'app/services/seguridad/perfiles.service';
import { UsuariosService } from 'app/services/seguridad/usuarios.service';
import { Helper } from 'app/helpers/helper';
import { Router, ActivatedRoute, Params } from '@angular/router';
declare var $:any;

@Component({
  selector: 'app-usuario-edit',
  templateUrl: './usuario-edit.component.html',
  styleUrls: ['./usuario-edit.component.css']
})
export class UsuarioEditComponent implements OnInit {
  public model:Usuario=new Usuario();
  public perfiles:Perfil[]=[];
  public valids:string[]=[];
  public formOK:boolean=false;
  public usuariosRegistrados:Usuario[]=[];
  public confirmClave:string='';
  public usuarioOLD:string='';
  public razonsocialOLD:string='';
  public emailOLD:string='';
  constructor(private _appComponent:AppComponent, 
    private _perfilesService:PerfilesService, 
    private _usuariosService:UsuariosService,
    private _helper:Helper,
    private _router:Router,
    private _activatedRoute:ActivatedRoute) { 
  	  let _usuario:string="";
      this._activatedRoute.params.forEach((params:Params)=>{
        _usuario=params["usuario"];
      });
      if (!_usuario){
          this._helper.notificationToast("No hemos podido identificar el código del perfil a editar","Perfiles","error");
          this._router.navigate(["/usuarios"]);
      }else{
        this.getUsuario();
      }
      
      this.cargarPerfiles();
      this.cargarUsuariosRegistrados();
  
      /**validaciones */
      this.valids['usuario']={error:""};
      this.valids['email']={error:""};
      this.valids['perfilid']={error:""};
      this.valids['clave']={error:""};
      this.valids['fechanacimiento']={error:""};
      this.valids['nombres']={error:""};
      this.valids['apellidos']={error:""};
      /**fin validaciones */
  }

  ngOnInit() {
  	$('.i-checks').iCheck({
        checkboxClass: 'icheckbox_square-green',
        radioClass: 'iradio_square-green',
    });
     $('#fechanacimiento .input-group.date').datepicker({
        startView: 2,
        todayBtn: "linked",
        keyboardNavigation: false,
        forceParse: false,
        autoclose: true
    });
     $('#fechanacimiento .input-group.date').on('change',()=>{
        this.validaciones();
    });
    
    $('#activo').on('click change', function(e) {
        // console.log(e.type);
    });
  }
  public goBack(){
    this._helper.goBack();
  }
  public refrescarNavegacion(){
    // this._appComponent.setTitle("Editando Perfil "+this.perfil.denominacion);
    let links:Navlink[]=[
      {url:"/usuarios",title:"Usuarios",active:false},
      {url:"",title:"Edición de usuario "+this.razonsocialOLD,active:true}
      ];
    this._appComponent.setLinks(links);
  }
  public getUsuario(){
    let _usuario:string;
    this._activatedRoute.params.forEach((params:Params)=>{
      _usuario=params["usuario"];
    });
    if(_usuario!=="")
      this._usuariosService.getUsuario(_usuario)
          .subscribe(
            usuario => {
              this.model=usuario;
              this.usuarioOLD=this.model.usuario;
              this.razonsocialOLD=this.model.nombres+' '+this.model.apellidos;
              this.emailOLD=this.model.email;
              console.log(this.model.activo);
              if(parseInt(this.model.activo.toString())===1){
                this._helper.setCheckedRadio("activo");                
                //$('activo').attr("checked","checked");                
                //console.log($('activo').attr("checked"));
                //$('#inactivo .iradio_square-green:last').attr('class','iradio_square-green');                
                //$('#activo .iradio_square-green:last').attr('class','iradio_square-green checked');
              }else{
                console.log('Inactivo');
                
                // $('#inactivo .iradio_square-green:last').attr('class','iradio_square-green checked');
                // $('#activo .iradio_square-green:last').attr('class','iradio_square-green');
                this._helper.setCheckedRadio("inactivo");                
              }
              if(parseInt(this.model.masculino.toString())===1){
                this._helper.setCheckedRadio("masculino");
              }else{
                this._helper.setCheckedRadio("femenino");                
              }
              let yyyy=(this.model.fechanacimiento.toString().substr(0,4));
              let mm=(this.model.fechanacimiento.toString().substr(5,2));
              let dd=(this.model.fechanacimiento.toString().substr(8,2));
              
              //let d:Date=new Date(this.model.fechanacimiento.toString().substr(0,4),this.model.fechanacimiento.toString().substr(5,2),this.model.fechanacimiento.toString().substr(7,2),0,0,0,0);
              $("input[name='fechanacimiento']").val(dd+'/'+mm+'/'+yyyy);
              this.refrescarNavegacion();
              this.validaciones();
              
            }
          );
  }
 
  public cargarPerfiles(){
    this._perfilesService.getPerfiles()
        .subscribe(
          perfiles => {
            this.perfiles=perfiles;
          }
        );
  }
  public cargarUsuariosRegistrados(){
    this._usuariosService.getUsuarios()
        .subscribe(
          usuarios => {
            // console.log(usuarios);
            this.usuariosRegistrados=usuarios;
          }
        );
  }
  public validaciones(){
    this.formOK=true;
    console.log("Perfilid: "+this.model.perfilid);
    this.valids['usuario']={error:""};
    this.valids['email']={error:""};
    this.valids['perfilid']={error:""};
    this.valids['clave']={error:""};
    this.valids['fechanacimiento']={error:""};
    this.valids['nombres']={error:""};
    this.valids['apellidos']={error:""};

    /**Perfil */
    if(this.model.perfilid===""){
      this.valids['perfilid']={error:"El perfil es un campo obligatorio"};
      this.formOK=false;
    }
    /**Nombre del Usuario */
    if(!this.formOK)return;
    if(this.model.usuario===''){
      this.valids['usuario']={error:"El usuario es un campo obligatorio"};
      this.formOK=false;
    }else{
      
      this.valids['usuario']={error:""};
      this.usuariosRegistrados.forEach(function(usuario:Usuario) {
        if(this.valids['usuario'].error==="")
          if(usuario.usuario===this.model.usuario&&usuario.usuario!=this.usuarioOLD){
              this.valids['usuario']={error:"Nombre de usuario no disponible"};
              this.formOK=false;
          }
      }, this);
    }
    /**email */
    if(!this.formOK)return;
    if(this.model.email===""){
      this.valids['email']={error:"El correo es un campo obligatorio"};
      this.formOK=false;
    }else{
      if(this._helper.emailValido(this.model.email)){
        this.usuariosRegistrados.forEach(function(usuario:Usuario) {
          if(this.valids['email'].error==="")
            if(usuario.email===this.model.email&&usuario.email!=this.emailOLD){
                this.valids['email']={error:"Correo electrónico no disponible"};
                this.formOK=false;
            }
        }, this);
      }else{
        this.valids['email']={error:"Formato de correo electrónico inválido"};
      }
    }
    /**claves */
    if(!this.formOK)return;
    if(this.model.clave===""){
      this.valids['clave']={error:"La contraseña es un campo obligatorio"}
      this.formOK=false;
    }else{
      if(this.model.clave!==this.confirmClave){
        this.valids['clave']={error:"Las contraseñas no coinciden"}
        this.formOK=false;
      }
    }
     /**nombres */
    if(!this.formOK)return;
    if(this.model.nombres===""){
      this.valids['nombres']={error:"Debes escribir al menos un nombre"}
      this.formOK=false;
    }
     /**apellidos */
    if(!this.formOK)return;
    if(this.model.apellidos===""){
      this.valids['apellidos']={error:"Debes escribir al menos un apellido"}
      this.formOK=false;
    }
    /**fecha de nacimiento */
    if(!this.formOK)return;
    // let fechanacimiento:string=this._helper.getFecha("fechanacimiento");
    // if(fechanacimiento===""){
    //   this.valids['fechanacimiento']={error:"La fecha de nacimiento es obligatoria"}
    //   this.formOK=false;
    // }else{
    //   if(!this._helper.fechavalida(fechanacimiento)){
    //     this.valids['fechanacimiento']={error:"Debes ingresar una fecha válida en formato dd/mm/aaaa"}
    //     this.formOK=false;
    //   }else{

        
    //   }
    //   // console.log(fechanacimiento);
    //   // console.log(this.model.fechanacimiento);
    // }
    // this.formOK=false;
    // console.log(this.formOK);
  }
  onSubmit(){
    // console.log(this.model);
    if(!this.formOK){
      this._helper.notificationToast("Debes rellenar el formulario correctamente","Registro de usuarios","error");
      return false;
    }

    var separators = ['\\.', '\\-', '\\/'];
    let bits = this._helper.getFecha("fechanacimiento").split(new RegExp(separators.join('|'), 'g'));
    let yyyy:any=bits[2];
    let mm:any=bits[1];
    let dd:any=bits[0];
    this.model.fechanacimiento = new Date(yyyy, mm, dd);
    // console.log(this.model.fechanacimiento);
    let _perfilId:string;
    this.model.masculino=this._helper.getCheckedRadio("masculino");
    if(_perfilId!=="")
      this._usuariosService.editUsuario(this.usuarioOLD,this.model)
          .subscribe(
            actualizado => {
              console.log(actualizado);
              if(actualizado){
                // this._router.navigate(['/usuarios']);
              }
            }
          );

    return false;
  }

}
