import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContragentCardComponent } from './contragent-card.component';

describe('ContragentCardComponent', () => {
  let component: ContragentCardComponent;
  let fixture: ComponentFixture<ContragentCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContragentCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContragentCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
