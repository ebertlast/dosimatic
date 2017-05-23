import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { Aprobacion } from 'app/models/index';
@Component({
  selector: 'app-docbox-content',
  templateUrl: './docbox-content.component.html',
  styleUrls: ['./docbox-content.component.css']
})
export class DocboxContentComponent implements OnInit, OnChanges {
  @Input()
  public pendientes: Aprobacion[]= [];
  @Output() public emit = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
  }
  public filtrar(filtro: string) {
    this.emit.emit({filtro: 'in:' + filtro});
  }

}
