import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LkMessageDateComponent } from './lk-message-date.component';

describe('LkMessageDateComponent', () => {
  let component: LkMessageDateComponent;
  let fixture: ComponentFixture<LkMessageDateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LkMessageDateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LkMessageDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
