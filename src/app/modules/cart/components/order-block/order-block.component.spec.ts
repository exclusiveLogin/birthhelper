import { ComponentFixture, TestBed } from "@angular/core/testing";

import { OrderBlockComponent } from "./order-block.component";

describe("OrderBlockComponent", () => {
    let component: OrderBlockComponent;
    let fixture: ComponentFixture<OrderBlockComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [OrderBlockComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(OrderBlockComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
