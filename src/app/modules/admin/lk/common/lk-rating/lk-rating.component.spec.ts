import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LkRatingComponent } from './lk-rating.component';

describe('LkRatingComponent', () => {
  let component: LkRatingComponent;
  let fixture: ComponentFixture<LkRatingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LkRatingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LkRatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
