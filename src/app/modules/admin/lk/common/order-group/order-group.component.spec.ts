import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderGroupComponent } from './order-group.component';

describe('OrderGroupComponent', () => {
  let component: OrderGroupComponent;
  let fixture: ComponentFixture<OrderGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderGroupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
