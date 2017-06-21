import { Component } from '@angular/core';
import { Usuario } from './models/usuario';
import { Navlink } from './models/navlink';
import { app } from '../environments/environment';
import { Helper } from './helpers/helper';

declare var $: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app works!';
  public currentUser: Usuario = new Usuario();
  links: Navlink[] = [];
  constructor(
    private _helper: Helper
  ) {
    if (localStorage.getItem(app.currentuser)) {
      this.currentUser = JSON.parse(localStorage.getItem(app.currentuser)).usuario;
    }
  }

  public setUsuario(user: Usuario){
    this.currentUser = user;
    if (this.currentUser.usuario === '') {
      $('body').addClass('fixed-sidebar mini-navbar');
    } else {
      $('body').removeClass('fixed-sidebar').removeClass('mini-navbar');
    }
  }
  public setLinks(links: Navlink[]) {
    this.links = links;
  }


}
