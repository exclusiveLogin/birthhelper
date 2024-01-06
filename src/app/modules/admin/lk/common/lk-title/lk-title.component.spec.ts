import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LkTitleComponent } from './lk-title.component';

describe('LkTitleComponent', () => {
  let component: LkTitleComponent;
  let fixture: ComponentFixture<LkTitleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LkTitleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LkTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
