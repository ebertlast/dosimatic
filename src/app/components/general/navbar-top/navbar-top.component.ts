import { Component, OnInit } from '@angular/core';
import { app } from '../../../../environments/environment';
@Component({
  selector: 'app-navbar-top',
  templateUrl: './navbar-top.component.html',
  styleUrls: ['./navbar-top.component.css']
})
export class NavbarTopComponent implements OnInit {
  
  app=app;
  constructor() { }

  ngOnInit() {
  }

  

}
