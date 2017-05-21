import { Component, OnInit } from '@angular/core';
import { AppComponent } from 'app/app.component';
import { Navlink } from 'app/models/navlink';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private _appComponent:AppComponent) { }

  ngOnInit() {
    let links:Navlink[]=[];
    this._appComponent.setLinks(links);
  }
  

}
