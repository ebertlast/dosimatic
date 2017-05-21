import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchivoAddComponent } from './archivo-add.component';

describe('ArchivoAddComponent', () => {
  let component: ArchivoAddComponent;
  let fixture: ComponentFixture<ArchivoAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArchivoAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArchivoAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
