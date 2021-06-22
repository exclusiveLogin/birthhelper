import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Clinic.CardComponent } from './clinic.card.component';

describe('Clinic.CardComponent', () => {
  let component: Clinic.CardComponent;
  let fixture: ComponentFixture<Clinic.CardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Clinic.CardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Clinic.CardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
