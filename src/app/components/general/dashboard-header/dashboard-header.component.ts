import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Navlink } from 'app/models/navLink';

@Component({
  selector: 'app-dashboard-header',
  templateUrl: './dashboard-header.component.html',
  styleUrls: ['./dashboard-header.component.css']
})
export class DashboardHeaderComponent implements OnInit, OnChanges  {
  @Input()
  public navLinks:Navlink[]=[];
  public title:string="";
  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes:SimpleChanges){
    this.construirNavegacion(this.navLinks);
  }
  
  public construirNavegacion(links:Navlink[]){
    this.navLinks=[{url:"",title:"Inicio",active:false}];
    if(links!==null)
      links.forEach(element => {
        if(element.title!="")
          this.navLinks.push(element);
      });
  }

}
