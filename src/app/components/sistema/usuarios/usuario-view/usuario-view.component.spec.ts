import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuarioViewComponent } from './usuario-view.component';

describe('UsuarioViewComponent', () => {
  let component: UsuarioViewComponent;
  let fixture: ComponentFixture<UsuarioViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsuarioViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsuarioViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
