import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BhDoingComponent } from './bh-doing.component';

describe('BhDoingComponent', () => {
  let component: BhDoingComponent;
  let fixture: ComponentFixture<BhDoingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BhDoingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BhDoingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
