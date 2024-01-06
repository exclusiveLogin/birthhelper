import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LkSimpleCardComponent } from './lk-simple-card.component';

describe('LkSimpleCardComponent', () => {
  let component: LkSimpleCardComponent;
  let fixture: ComponentFixture<LkSimpleCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LkSimpleCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LkSimpleCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
