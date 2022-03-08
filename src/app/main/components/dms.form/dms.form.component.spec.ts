import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Dms.FormComponent } from './dms.form.component';

describe('Dms.FormComponent', () => {
  let component: Dms.FormComponent;
  let fixture: ComponentFixture<Dms.FormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Dms.FormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Dms.FormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
