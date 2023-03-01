import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LkUserCardComponent } from './lk-user-card.component';

describe('LkUserCardComponent', () => {
  let component: LkUserCardComponent;
  let fixture: ComponentFixture<LkUserCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LkUserCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LkUserCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
