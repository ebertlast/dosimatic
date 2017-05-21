import { Component, OnInit } from '@angular/core';
import { app } from '../../../../environments/environment';
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  app=app;
  constructor() { }
  ngOnInit() {
  }

}
