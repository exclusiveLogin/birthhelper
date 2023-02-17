import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LkFeedbackComponent } from './lk-feedback.component';

describe('LkFeedbackComponent', () => {
  let component: LkFeedbackComponent;
  let fixture: ComponentFixture<LkFeedbackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LkFeedbackComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LkFeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
