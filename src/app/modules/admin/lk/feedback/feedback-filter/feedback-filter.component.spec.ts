import { ComponentFixture, TestBed } from "@angular/core/testing";

import { FeedbackFilterComponent } from "app/modules/admin/lk/feedback/feedback-filter/feedback-filter.component";

describe("OrdersFilterComponent", () => {
    let component: FeedbackFilterComponent;
    let fixture: ComponentFixture<FeedbackFilterComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [FeedbackFilterComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(FeedbackFilterComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
