import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderListHeaderComponent } from './order-list-header.component';

describe('OrderListHeaderComponent', () => {
  let component: OrderListHeaderComponent;
  let fixture: ComponentFixture<OrderListHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderListHeaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderListHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
