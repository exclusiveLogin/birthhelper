import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LkConfirmChanelComponent } from './lk-confirm-chanel.component';

describe('LkConfirmChanelComponent', () => {
  let component: LkConfirmChanelComponent;
  let fixture: ComponentFixture<LkConfirmChanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LkConfirmChanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LkConfirmChanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
