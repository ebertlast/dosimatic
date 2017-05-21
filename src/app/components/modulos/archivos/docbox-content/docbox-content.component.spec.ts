import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocboxContentComponent } from './docbox-content.component';

describe('DocboxContentComponent', () => {
  let component: DocboxContentComponent;
  let fixture: ComponentFixture<DocboxContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocboxContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocboxContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
