import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LkAvatarComponent } from './lk-avatar.component';

describe('LkAvatarComponent', () => {
  let component: LkAvatarComponent;
  let fixture: ComponentFixture<LkAvatarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LkAvatarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LkAvatarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
