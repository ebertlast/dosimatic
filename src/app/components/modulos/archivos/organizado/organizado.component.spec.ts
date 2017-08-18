import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizadoComponent } from './organizado.component';

describe('OrganizadoComponent', () => {
  let component: OrganizadoComponent;
  let fixture: ComponentFixture<OrganizadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrganizadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
