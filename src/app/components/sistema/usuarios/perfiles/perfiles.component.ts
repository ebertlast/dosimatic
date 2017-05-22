import { Component, OnInit } from '@angular/core';
import { AppComponent } from 'app/app.component';
import { Helper } from 'app/helpers/helper';
import { Navlink } from 'app/models/navlink';
import { Perfil } from 'app/models/perfil';
import { Usuario } from 'app/models/usuario';
import { PerfilesService } from 'app/services/seguridad/perfiles.service';
import { UsuariosService } from 'app/services/seguridad/usuarios.service';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-perfiles',
  templateUrl: './perfiles.component.html',
  styleUrls: ['./perfiles.component.css']
})
export class PerfilesComponent implements OnInit {
	public perfiles:Perfil[]=[];
	public usuarios:Usuario[]=[];
	constructor(
		private _appComponent:AppComponent,
		private _perfilesService:PerfilesService,
		private _helper:Helper,
		private _usuariosService:UsuariosService
		) { 
		let links:Navlink[]=[{url:"usuarios",title:"Usuarios",active:false},{url:"",title:"Perfiles",active:true}];
    this._appComponent.setLinks(links);
	}

	ngOnInit() {
		this.cargarPerfiles();
	}

	public cargarPerfiles(){
		this._perfilesService.getPerfiles()
		    .subscribe(
		      perfiles => {
		        this.perfiles=perfiles;
		        // if(!environment.production && environment.depurar){
		        //   console.log("Perfiles: ");
		        //   console.log(this.perfiles);
		        // }
		        this.getUsuarios();
		      }
		    );
	}

	private getUsuarios(){
	// console.log(_perfilId);
		this._usuariosService.getUsuarios()
		    .subscribe(
		      usuarios => {
		        this.usuarios=usuarios;
		        this._helper.revisarAvatarsDeUsuarios(this.usuarios);
		      }
		    );
	}

}
