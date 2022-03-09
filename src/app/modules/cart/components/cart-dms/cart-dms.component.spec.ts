import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartDmsComponent } from './cart-dms.component';

describe('CartDmsComponent', () => {
  let component: CartDmsComponent;
  let fixture: ComponentFixture<CartDmsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CartDmsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CartDmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
