import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClinicHeaderComponent } from './clinic-header.component';

describe('ClinicHeaderComponent', () => {
  let component: ClinicHeaderComponent;
  let fixture: ComponentFixture<ClinicHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClinicHeaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClinicHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
