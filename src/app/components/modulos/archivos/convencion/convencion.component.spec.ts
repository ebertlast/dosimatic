import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConvencionComponent } from './convencion.component';

describe('ConvencionComponent', () => {
  let component: ConvencionComponent;
  let fixture: ComponentFixture<ConvencionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConvencionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConvencionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
