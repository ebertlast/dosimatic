import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchivoViewComponent } from './archivo-view.component';

describe('ArchivoViewComponent', () => {
  let component: ArchivoViewComponent;
  let fixture: ComponentFixture<ArchivoViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArchivoViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArchivoViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
