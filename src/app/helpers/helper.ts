import { Injectable } from '@angular/core';
import { Usuario } from 'app/models/usuario';
import { Location } from '@angular/common';

declare var toastr: any;
declare var $: any;

@Injectable()
export class Helper {
    constructor(
        private _location: Location
    ) {}
    public notificationToast(message: string, title: string, type = 'success'): void {
        toastr.options = {
          'closeButton': true,
          'debug': false,
          'progressBar': true,
          'preventDuplicates': true,
          'positionClass': 'toast-top-right',
          'onclick': null,
          'showDuration': '400',
          'hideDuration': '1000',
          'timeOut': '7000',
          'extendedTimeOut': '1000',
          'showEasing': 'swing',
          'hideEasing': 'linear',
          'showMethod': 'fadeIn',
          'hideMethod': 'fadeOut'
        }
        switch (type) {
          case 'success':
            toastr.success(message, title);
            break;
          case 'error':
            toastr.error(message, title);
            break;
          case 'warning':
            toastr.warning(message, title);
            break;
          case 'info':
            toastr.info(message, title);
            break;
          default:
            toastr.success(message, title);
            break;
        }
    }
    public animateDiv(idDiv: string, animation: string) {
      $('#' + idDiv)
        .removeClass()
        .addClass(animation + ' animated')
        .one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
          $(this).removeClass();
        });
    }
    public goBack() {
      this._location.back();
    }
    /**
     * Devuelve verdadero si esta tildado y falso si no
     * <div id="i-checks-activo" class="i-checks">
     *   <label>
     *     <input type="radio" name="activo" [(ngModel)]="perfil.activo" ngControl="activo" ngControl="activo" [value]="1">
     *     <i></i> Activo
     *   </label>
     * </div>
     */
    public getCheckedRadio(idDivContent: string): boolean{
      return $('#' + idDivContent + ' .iradio_square-green:last').hasClass('checked');
    }
    /**
     * Establece los tildes a los radio buttons
     */
    public setCheckedRadio(idDivContent: string, add: boolean = true): void {
      if (add) {
        // $('#'+idDivContent+' .iradio_square-green:first').addClass("checked");
        $('#' + idDivContent + ' .iradio_square-green:last').attr('class', 'iradio_square-green checked');
      }else{
        $('#' + idDivContent + ' .iradio_square-green:last').attr('class', 'iradio_square-green');
        // $('#'+idDivContent+' .iradio_square-green:first').removeClass("checked");
      }
    }
    public getFecha(idDivContent: string): string {
      return( $('#' + idDivContent + ' .date:first input:first').val());
    }
    public revisarAvatarsDeUsuarios(usuarios:Usuario[]) {
      // console.log("Usuarios en foreach:");
      usuarios.forEach(function(usuario: Usuario) {
        if (usuario.avatar === null || usuario.avatar === '') {
          if (usuario.nombres.substr(0, 1) !== '') {
            usuario.avatar = 'assets/avatars/alfabeto/' + usuario.nombres.substr(0, 1) + '.png';
          }else {
            usuario.avatar = 'assets/avatars/user-default.jpg';
          }
        }
      }, this);
    }
    public revisarAvatarDeUsuario(usuario: Usuario) {
      // console.log("Usuarios en foreach:");
        if (usuario.avatar === null || usuario.avatar === '') {
          if (usuario.nombres.substr(0, 1) !== '') {
            usuario.avatar = 'assets/avatars/alfabeto/' + usuario.nombres.substr(0, 1) + '.png';
          }else{
            usuario.avatar = 'assets/avatars/user-default.jpg';
          }
        }
    }
    public emailValido(email: string): boolean {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }
    public fechavalida(s: string): boolean{
        const separators = ['\\.', '\\-', '\\/'];
        const bits = s.split(new RegExp(separators.join('|'), 'g'));
        const yyyy: any = bits[2];
        const mm: any = bits[1];
        const dd: any = bits[0];
        const d = new Date(yyyy, mm - 1, dd);
        return d.getFullYear() === yyyy && d.getMonth() + 1 === mm;
    }

    public capitalize(s){
        return s.toLowerCase().replace( /\b./g, function(a){ return a.toUpperCase(); } );
    };

}
