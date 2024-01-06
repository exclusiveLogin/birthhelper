import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LkRatingGroupComponent } from './lk-rating-group.component';

describe('LkRatingGroupComponent', () => {
  let component: LkRatingGroupComponent;
  let fixture: ComponentFixture<LkRatingGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LkRatingGroupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LkRatingGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
