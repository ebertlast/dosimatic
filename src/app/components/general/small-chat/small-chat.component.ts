import { Component, OnInit } from '@angular/core';
import { app } from '../../../../environments/environment';
@Component({
  selector: 'app-small-chat',
  templateUrl: './small-chat.component.html',
  styleUrls: ['./small-chat.component.css']
})
export class SmallChatComponent implements OnInit {
  habilitado: boolean = app.chatComponent;
  constructor() { }

  ngOnInit() {
  }

}
