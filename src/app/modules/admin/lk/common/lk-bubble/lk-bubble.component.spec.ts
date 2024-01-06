import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LkBubbleComponent } from './lk-bubble.component';

describe('LkBubbleComponent', () => {
  let component: LkBubbleComponent;
  let fixture: ComponentFixture<LkBubbleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LkBubbleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LkBubbleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
